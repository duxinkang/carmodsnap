'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Loader2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface VehicleViewerProps {
  className?: string;
  modelUrl?: string;      // 3D 模型 URL
  videoUrl?: string;      // 视频 URL（360°环绕视频）
  bodyColor?: string;     // 车身颜色
}

export function VehicleViewer({ 
  className = '', 
  modelUrl, 
  videoUrl, 
  bodyColor = '#ffffff' 
}: VehicleViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 模式判断：有 videoUrl 则使用视频模式，否则使用 3D 模型模式
  const isVideoMode = !!videoUrl;

  useEffect(() => {
    if (isVideoMode && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        setError(null);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setError('Video loading failed');
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      // 自动播放
      video.load();
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoUrl, isVideoMode]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 视频模式
  if (isVideoMode) {
    return (
      <div className={`relative w-full h-full bg-black rounded-xl overflow-hidden ${className}`}>
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <p className="text-sm mb-2">{error}</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => videoRef.current?.load()}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* 视频播放器 */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster="/models/video-poster.jpg"
        />

        {/* 播放控制 */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-black/50 backdrop-blur hover:bg-black/70"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-black/50 backdrop-blur hover:bg-black/70"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* 提示文字 */}
        {!isPlaying && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
              Click play to view 360° orbit
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3D 模型模式
  if (!modelUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">No 3D model loaded</p>
          <p className="text-xs mt-1">Switch to video mode or load a model</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [5, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* 车辆模型 */}
        <VehicleModel url={modelUrl} color={bodyColor} />
        
        {/* 交互控制 */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* 环境 */}
        <Environment preset="city" />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} />
      </Canvas>
    </div>
  );
}

function VehicleModel({ url, color }: { url: string; color: string }) {
  // TODO: 加载真实的 GLB 模型
  // 目前使用简单几何体作为占位符
  return (
    <group>
      {/* 车身 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* 车轮 */}
      {[
        [-1, 0.2, 1.2],
        [1, 0.2, 1.2],
        [-1, 0.2, -1.2],
        [1, 0.2, -1.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  );
}

export default VehicleViewer;
