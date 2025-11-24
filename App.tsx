import React, { useState } from 'react';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import { ShapeType, TextureState, TextureSettings, RotationSettings } from './types';

const App: React.FC = () => {
  const [currentShape, setCurrentShape] = useState<ShapeType>(ShapeType.CUBE);
  const [texture, setTexture] = useState<TextureState>({ url: null, name: '', source: 'none' });
  const [textureSettings, setTextureSettings] = useState<TextureSettings>({
    offsetX: 0,
    offsetY: 0,
    repeatX: 1,
    repeatY: 1,
    rotation: 0
  });
  const [rotationSettings, setRotationSettings] = useState<RotationSettings>({
    autoRotate: true,
    speed: 0.5,
    direction: 1
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextureChange = (url: string | null, name: string) => {
    setTexture({
      url,
      name,
      source: url ? (name === 'AI Generated' ? 'ai' : 'upload') : 'none'
    });
    // Reset settings on new texture
    if (url) {
      setTextureSettings({
        offsetX: 0,
        offsetY: 0,
        repeatX: 1,
        repeatY: 1,
        rotation: 0
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 3D Scene Background */}
      <Scene 
        currentShape={currentShape} 
        textureUrl={texture.url} 
        textureSettings={textureSettings}
        rotationSettings={rotationSettings}
      />

      {/* Foreground UI */}
      <ControlPanel
        currentShape={currentShape}
        onShapeChange={setCurrentShape}
        onTextureChange={handleTextureChange}
        textureSettings={textureSettings}
        onTextureSettingsChange={setTextureSettings}
        rotationSettings={rotationSettings}
        onRotationSettingsChange={setRotationSettings}
        textureSource={texture.source}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        error={error}
        setError={setError}
      />
      
      {/* Attribution/Info */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <p className="text-slate-500 text-xs">
          Interactive 3D Viewer <span className="mx-1">•</span> Powered by React Three Fiber & Gemini
        </p>
      </div>
    </div>
  );
};

export default App;