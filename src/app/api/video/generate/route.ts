/**
 * POST /api/video/generate - 生成车辆 360°环绕视频
 * 使用阿里云 DashScope VideoSynthesis API
 */

import { envConfigs } from '@/config';
import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';

const DASHSCOPE_API_KEY = envConfigs.dashscope_api_key || process.env.DASHSCOPE_API_KEY;
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis';

export async function POST(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in', 401);
    }

    const body = await request.json();
    const {
      carImage,        // 车辆图片 URL（可选）
      prompt,          // 自定义提示词（可选）
      duration = 5,    // 视频时长（秒）
    } = body;

    // 默认提示词 - 360 度环绕汽车
    const defaultPrompt = '360 degree orbit around a car, professional product showcase, cinematic lighting, smooth camera movement, 4k quality';
    const videoPrompt = prompt || defaultPrompt;

    if (!DASHSCOPE_API_KEY) {
      return respErr('DashScope API key not configured', 500);
    }

    // 构建请求体
    const requestBody: any = {
      model: 'wanx2.1-t2v-turbo',
      input: {
        prompt: videoPrompt,
      },
      parameters: {
        size: '1280*720',
        duration: duration,
      },
    };

    // 如果有图片，使用图生视频
    if (carImage) {
      requestBody.input.img_url = carImage;
      requestBody.model = 'wanx2.1-i2v-turbo'; // 图生视频模型
    }

    // 调用阿里云 API
    const response = await fetch(DASHSCOPE_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('DashScope API error:', result);
      return respErr(`Failed to create task: ${result.message || response.statusText}`, 500);
    }

    const task_id = result.output?.task_id;
    
    if (!task_id) {
      return respErr('Failed to get task_id', 500);
    }

    // 返回任务 ID，前端轮询状态
    return respData({
      task_id,
      message: 'Video generation task created',
      estimated_time: 60, // 预估 60 秒完成
    });

  } catch (e: any) {
    console.error('Video generation error:', e);
    return respErr(`Internal error: ${e.message}`, 500);
  }
}

/**
 * GET /api/video/status?task_id=xxx - 查询视频生成状态
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');

    if (!task_id) {
      return respErr('task_id is required', 400);
    }

    if (!DASHSCOPE_API_KEY) {
      return respErr('DashScope API key not configured', 500);
    }

    // 查询任务状态
    const statusUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${task_id}`;
    const response = await fetch(statusUrl, {
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return respErr(`Failed to fetch status: ${result.message || response.statusText}`, 500);
    }

    const task_status = result.output?.task_status;
    const video_url = result.output?.video_url;
    const message = result.output?.message;

    return respData({
      task_id,
      status: task_status, // PENDING, RUNNING, SUCCEEDED, FAILED, CANCELED
      video_url: task_status === 'SUCCEEDED' ? video_url : null,
      message: message || '',
    });

  } catch (e: any) {
    console.error('Video status check error:', e);
    return respErr(`Internal error: ${e.message}`, 500);
  }
}
