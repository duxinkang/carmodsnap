'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Color, Mesh, MeshStandardMaterial } from 'three';

interface VehicleModelProps {
  modelUrl: string;
  bodyColor: string;
}

/**
 * Vehicle GLB 模型渲染器。
 * 通过遍历模型 mesh，把车身材质颜色同步为当前选择颜色。
 */
export function VehicleModel({ modelUrl, bodyColor }: VehicleModelProps) {
  const { scene } = useGLTF(modelUrl);

  // 缓存颜色对象，避免每次渲染都创建新的 three.js Color 实例。
  const color = useMemo(() => new Color(bodyColor), [bodyColor]);

  useEffect(() => {
    scene.traverse((node) => {
      if (!(node instanceof Mesh)) {
        return;
      }

      // 统一把模型材质转换为标准材质，保证颜色和光照表现一致。
      if (Array.isArray(node.material)) {
        node.material = node.material.map((mat) => {
          const standardMaterial =
            mat instanceof MeshStandardMaterial
              ? mat
              : new MeshStandardMaterial();
          standardMaterial.color = color;
          standardMaterial.roughness = 0.35;
          standardMaterial.metalness = 0.25;
          return standardMaterial;
        });
        return;
      }

      const standardMaterial =
        node.material instanceof MeshStandardMaterial
          ? node.material
          : new MeshStandardMaterial();
      standardMaterial.color = color;
      standardMaterial.roughness = 0.35;
      standardMaterial.metalness = 0.25;
      node.material = standardMaterial;
    });
  }, [color, scene]);

  return <primitive object={scene} position={[0, -0.2, 0]} scale={1.35} />;
}

useGLTF.preload('/models/vehicle-base.glb');
