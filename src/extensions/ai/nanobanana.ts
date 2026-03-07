import {
  AIFile,
  AIGenerateParams,
  AIProvider,
  AIResult,
  AITaskInfo,
  AITaskStatus,
} from './types';

export interface NanoBananaConfig {
  apiKey: string;
  baseUrl?: string;
  customStorage?: boolean;
}

export class NanoBananaProvider implements AIProvider {
  readonly name = 'nanobanana';
  readonly mediaTypes = ['image', 'video'];

  private apiKey: string;
  private baseUrl: string;

  constructor(config: NanoBananaConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.nanobananaapi.ai/api/v1';
  }

  async generate(params: AIGenerateParams): Promise<AIResult> {
    const { prompt, model, options } = params;

    // Map aspect ratio
    let aspectRatio = 'auto';
    if (options?.size) {
      const [width, height] = options.size.split('*').map(Number);
      if (width && height) {
        const ratio = width / height;
        if (ratio > 1.7) aspectRatio = '21:9';
        else if (ratio > 1.4) aspectRatio = '16:9';
        else if (ratio > 1.1) aspectRatio = '4:3';
        else if (ratio > 0.8) aspectRatio = '1:1';
        else if (ratio > 0.6) aspectRatio = '3:4';
        else aspectRatio = '9:16';
      }
    }

    // Map resolution based on size
    let resolution = '1K';
    if (options?.size) {
      const [width] = options.size.split('*').map(Number);
      if (width && width > 1500) resolution = '2K';
      else if (width && width > 800) resolution = '1K';
      else resolution = '512';
    }

    const requestBody: Record<string, any> = {
      prompt,
      imageUrls: [],
      aspectRatio,
      resolution,
      googleSearch: false,
      outputFormat: options?.outputFormat || 'jpg',
    };

    // Add reference images if provided
    if (options?.images && options.images.length > 0) {
      requestBody.imageUrls = options.images;
    }

    const response = await fetch(`${this.baseUrl}/nanobanana/generate-2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NanoBanana API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Parse response - assuming it returns task info or direct image URL
    const taskId = data.taskId || data.id || '';
    const imageUrl = data.imageUrl || data.output?.imageUrl || data.result?.imageUrl || '';

    if (imageUrl) {
      // Task completed synchronously
      return {
        taskId,
        taskStatus: AITaskStatus.SUCCESS,
        taskInfo: {
          images: [{ imageUrl }],
        } as AITaskInfo,
      } as AIResult;
    }

    // Task is async, return pending status
    return {
      taskId,
      taskStatus: AITaskStatus.PENDING,
      taskInfo: {} as AITaskInfo,
    } as AIResult;
  }

  async query(params: {
    taskId: string;
    mediaType: string;
    model?: string;
  }): Promise<AIResult> {
    const { taskId } = params;

    const response = await fetch(`${this.baseUrl}/nanobanana/status/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to query task status: ${response.status}`);
    }

    const data = await response.json();

    const status = data.status || 'PENDING';
    const taskStatus =
      status === 'COMPLETED'
        ? AITaskStatus.SUCCESS
        : status === 'FAILED'
        ? AITaskStatus.FAILED
        : AITaskStatus.PENDING;

    const imageUrl = data.imageUrl || data.output?.imageUrl || data.result?.imageUrl || '';

    return {
      taskId,
      taskStatus,
      taskInfo: {
        images: imageUrl ? [{ imageUrl }] : [],
        errorMessage: data.error || undefined,
      } as AITaskInfo,
    } as AIResult;
  }

  async saveFiles(files: AIFile[]): Promise<AIFile[] | undefined> {
    if (!this.customStorage) {
      return files;
    }

    try {
      const { saveFiles } = await import('./index');
      return await saveFiles(files);
    } catch (error) {
      console.error('NanoBanana saveFiles failed:', error);
      return undefined;
    }
  }

  customStorage?: boolean | undefined;
}
