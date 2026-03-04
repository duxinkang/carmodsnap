'use client';

import { useState, useCallback } from 'react';

export interface VideoGenerationState {
  isGenerating: boolean;
  status: 'idle' | 'pending' | 'running' | 'succeeded' | 'failed' | 'canceled';
  videoUrl: string | null;
  taskId: string | null;
  error: string | null;
  progress: number;
}

/**
 * 车辆视频生成 Hook
 */
export function useVideoGeneration() {
  const [state, setState] = useState<VideoGenerationState>({
    isGenerating: false,
    status: 'idle',
    videoUrl: null,
    taskId: null,
    error: null,
    progress: 0,
  });

  /**
   * 生成车辆环绕视频
   * @param carImage 车辆图片 URL（可选）
   * @param prompt 自定义提示词（可选）
   */
  const generateVideo = useCallback(async (
    carImage?: string,
    prompt?: string
  ) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      status: 'pending',
      error: null,
      progress: 10,
    }));

    try {
      // 创建视频生成任务
      const createResponse = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carImage,
          prompt,
          duration: 5,
        }),
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createResult.message || 'Failed to create video task');
      }

      const taskId = createResult.data?.task_id;
      
      if (!taskId) {
        throw new Error('No task_id returned');
      }

      setState(prev => ({
        ...prev,
        taskId,
        status: 'running',
        progress: 30,
      }));

      // 轮询任务状态
      await pollVideoStatus(taskId);

    } catch (error: any) {
      console.error('Video generation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        status: 'failed',
        error: error.message || 'Video generation failed',
        progress: 0,
      }));
    }
  }, []);

  /**
   * 轮询视频生成状态
   */
  const pollVideoStatus = useCallback(async (taskId: string) => {
    const maxAttempts = 60; // 最多轮询 60 次（5 分钟）
    const pollInterval = 5000; // 5 秒一次

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`/api/video/status?task_id=${taskId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Status check failed');
        }

        const status = result.data?.status;
        const videoUrl = result.data?.video_url;

        // 更新进度
        const progress = Math.min(30 + (attempt * 70 / maxAttempts), 95);

        setState(prev => ({
          ...prev,
          status,
          progress,
        }));

        if (status === 'SUCCEEDED') {
          setState(prev => ({
            ...prev,
            isGenerating: false,
            status: 'succeeded',
            videoUrl,
            progress: 100,
          }));
          return;
        }

        if (status === 'FAILED' || status === 'CANCELED') {
          setState(prev => ({
            ...prev,
            isGenerating: false,
            status,
            error: result.data?.message || 'Video generation failed',
            progress: 0,
          }));
          return;
        }

        // 等待下次轮询
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (error: any) {
        console.error('Status check error:', error);
        setState(prev => ({
          ...prev,
          isGenerating: false,
          status: 'failed',
          error: error.message,
          progress: 0,
        }));
        return;
      }
    }

    // 超时
    setState(prev => ({
      ...prev,
      isGenerating: false,
      status: 'failed',
      error: 'Video generation timeout',
      progress: 0,
    }));
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      status: 'idle',
      videoUrl: null,
      taskId: null,
      error: null,
      progress: 0,
    });
  }, []);

  return {
    ...state,
    generateVideo,
    reset,
  };
}
