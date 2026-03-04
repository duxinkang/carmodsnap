'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface VideoGenerationState {
  isLoading: boolean;
  isGenerating: boolean;
  taskId: string | null;
  videoUrl: string | null;
  status: 'idle' | 'pending' | 'running' | 'succeeded' | 'failed' | 'canceled';
  error: string | null;
}

const POLL_INTERVAL = 3000; // 3 秒轮询一次

export function useVideoGeneration() {
  const [state, setState] = useState<VideoGenerationState>({
    isLoading: false,
    isGenerating: false,
    taskId: null,
    videoUrl: null,
    status: 'idle',
    error: null,
  });

  // 生成视频
  const generateVideo = useCallback(async (
    carImage?: string,
    prompt?: string
  ) => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carImage,
          prompt,
          duration: 5,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate video');
      }

      const { task_id } = result.data;
      setState(prev => ({
        ...prev,
        taskId: task_id,
        status: 'pending',
      }));

      // 开始轮询状态
      pollStatus(task_id);

    } catch (error: any) {
      console.error('Video generation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message,
      }));
      toast.error(`Video generation failed: ${error.message}`);
    }
  }, []);

  // 轮询任务状态
  const pollStatus = useCallback(async (taskId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/video/status?task_id=${taskId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to check status');
        }

        const { status, video_url, message } = result.data;

        setState(prev => ({
          ...prev,
          status,
          videoUrl: video_url,
          error: status === 'failed' ? message : null,
        }));

        if (status === 'succeeded') {
          setState(prev => ({ ...prev, isGenerating: false }));
          toast.success('Video generated successfully!');
        } else if (status === 'failed' || status === 'canceled') {
          setState(prev => ({ ...prev, isGenerating: false }));
          toast.error(`Video generation failed: ${message}`);
        } else {
          // 继续轮询
          setTimeout(poll, POLL_INTERVAL);
        }

      } catch (error: any) {
        console.error('Status poll error:', error);
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: error.message,
        }));
        toast.error(`Status check failed: ${error.message}`);
      }
    };

    poll();
  }, []);

  // 重置状态
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isGenerating: false,
      taskId: null,
      videoUrl: null,
      status: 'idle',
      error: null,
    });
  }, []);

  return {
    ...state,
    generateVideo,
    reset,
  };
}
