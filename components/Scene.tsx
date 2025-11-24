import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment, Html } from '@react-three/drei';
import { ShapeType, TextureSettings, RotationSettings } from '../types';
import { ShapeRenderer } from './ShapeMeshes';

interface SceneProps {
  currentShape: ShapeType;
  textureUrl: string | null;
  textureSettings: TextureSettings;
  rotationSettings: RotationSettings;
}

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-2 text-white">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium">Loading Texture...</span>
    </div>
  </Html>
);

const Scene: React.FC<SceneProps> = ({ currentShape, textureUrl, textureSettings, rotationSettings }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.5} adjustCamera={false}>
            <ShapeRenderer type={currentShape} textureUrl={textureUrl} textureSettings={textureSettings} />
          </Stage>
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls 
          makeDefault 
          autoRotate={rotationSettings.autoRotate}
          autoRotateSpeed={rotationSettings.speed * rotationSettings.direction}
        />
      </Canvas>
    </div>
  );
};

export default Scene;