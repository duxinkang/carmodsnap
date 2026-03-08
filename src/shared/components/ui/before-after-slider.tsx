'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeFallbackImage?: string;
  afterFallbackImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeFallbackImage,
  afterFallbackImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  aspectRatio = 'video',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeSrc, setBeforeSrc] = useState(beforeImage);
  const [afterSrc, setAfterSrc] = useState(afterImage);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBeforeSrc(beforeImage);
  }, [beforeImage]);

  useEffect(() => {
    setAfterSrc(afterImage);
  }, [afterImage]);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    },
    [isDragging, updateSliderPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updateSliderPosition(e.touches[0].clientX);
    },
    [updateSliderPosition]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      updateSliderPosition(e.clientX);
    },
    [updateSliderPosition]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none overflow-hidden rounded-xl',
        aspectRatio === 'video' && 'aspect-video',
        aspectRatio === 'square' && 'aspect-square',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src={afterSrc}
          alt="After"
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => {
            if (afterFallbackImage && afterSrc !== afterFallbackImage) {
              setAfterSrc(afterFallbackImage);
            }
          }}
        />
        <div className="absolute top-4 right-4 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt="Before"
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => {
            if (beforeFallbackImage && beforeSrc !== beforeFallbackImage) {
              setBeforeSrc(beforeFallbackImage);
            }
          }}
        />
        <div className="absolute top-4 left-4 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
        <span>Before</span>
        <div className="h-1 w-24 rounded-full bg-white/30 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${sliderPosition}%` }}
          />
        </div>
        <span>After</span>
      </div>
    </div>
  );
}
