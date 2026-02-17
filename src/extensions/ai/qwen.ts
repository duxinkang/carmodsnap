import { getUuid } from '@/shared/lib/hash';

import { saveFiles } from '.';
import {
  AIConfigs,
  AIFile,
  AIGenerateParams,
  AIImage,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
} from './types';

export interface QwenConfigs extends AIConfigs {
  apiKey: string;
  baseUrl?: string;
  customStorage?: boolean;
}

export interface QwenImageResponse {
  request_id: string;
  output: {
    choices?: Array<{
      finish_reason: string;
      message: {
        content: Array<{
          image?: string;
          text?: string;
        }>;
        role: string;
      };
    }>;
    task_metric?: {
      FAILED: number;
      SUCCEEDED: number;
      TOTAL: number;
    };
  };
  usage?: {
    height: number;
    image_count: number;
    width: number;
  };
  code?: string;
  message?: string;
}

export class QwenProvider implements AIProvider {
  readonly name = 'qwen';
  configs: QwenConfigs;
  private baseUrl: string;

  constructor(configs: QwenConfigs) {
    this.configs = configs;
    this.baseUrl = configs.baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
  }

  async generate({ params }: { params: AIGenerateParams }): Promise<AITaskResult> {
    const { model, prompt, options } = params;

    if (!model) {
      throw new Error('model is required');
    }

    if (!prompt) {
      throw new Error('prompt is required');
    }

    const requestBody: any = {
      model,
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      parameters: {
        style: options?.style || 'auto',
        size: options?.size || '1024*1024',
        n: options?.n || 1,
        seed: options?.seed,
        negative_prompt: options?.negative_prompt,
      },
    };

    if (options?.ref_image) {
      requestBody.input.messages[0].content.push({
        image: options.ref_image
      });
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.configs.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Qwen API error: ${response.status} - ${errorText}`);
    }

    const data: QwenImageResponse = await response.json();

    if (data.code) {
      throw new Error(`Qwen API error: ${data.code} - ${data.message}`);
    }

    const taskId = getUuid();
    
    if (data.output.choices && data.output.choices.length > 0) {
      const images: AIImage[] = [];
      
      for (const choice of data.output.choices) {
        for (const content of choice.message.content) {
          if (content.image) {
            images.push({
              imageUrl: content.image,
            });
          }
        }
      }
      
      if (images.length > 0) {
        return {
          taskStatus: AITaskStatus.SUCCESS,
          taskId,
          taskInfo: { images },
          taskResult: data,
        };
      }
    }
    
    return {
      taskStatus: AITaskStatus.PENDING,
      taskId,
      taskInfo: {},
      taskResult: data,
    };
  }

  async query({
    taskId,
  }: {
    taskId: string;
    mediaType?: AIMediaType;
  }): Promise<AITaskResult> {
    return {
      taskId,
      taskStatus: AITaskStatus.SUCCESS,
      taskInfo: {},
      taskResult: {},
    };
  }
}
