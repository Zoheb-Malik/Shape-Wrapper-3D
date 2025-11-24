import React, { useState } from 'react';
import { ShapeType, TextureSettings, RotationSettings } from '../types';
import { Box, Circle, Triangle, Star, Heart, Activity, Upload, Wand2, X, AlertCircle, Settings2, RotateCw, Move, Maximize, Play, Pause, FastForward, RotateCcw, Clapperboard } from 'lucide-react';
import { generateTexture } from '../services/geminiService';

interface ControlPanelProps {
  currentShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  onTextureChange: (url: string | null, name: string) => void;
  textureSettings: TextureSettings;
  onTextureSettingsChange: (settings: TextureSettings) => void;
  rotationSettings: RotationSettings;
  onRotationSettingsChange: (settings: RotationSettings) => void;
  textureSource: 'upload' | 'ai' | 'none';
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const shapes = [
  { id: ShapeType.CUBE, label: 'Cube', icon: Box },
  { id: ShapeType.SPHERE, label: 'Sphere', icon: Circle },
  { id: ShapeType.PYRAMID, label: 'Pyramid', icon: Triangle },
  { id: ShapeType.TORUS, label: 'Donut', icon: Activity },
  { id: ShapeType.ICOSAHEDRON, label: 'Gem', icon: Star },
  { id: ShapeType.HEART, label: 'Heart', icon: Heart },
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentShape,
  onShapeChange,
  onTextureChange,
  textureSettings,
  onTextureSettingsChange,
  rotationSettings,
  onRotationSettingsChange,
  textureSource,
  isGenerating,
  setIsGenerating,
  error,
  setError
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'ai'>('upload');
  const [prompt, setPrompt] = useState('');
  const [showTextureSettings, setShowTextureSettings] = useState(true);
  const [showAnimSettings, setShowAnimSettings] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onTextureChange(url, file.name);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const base64Image = await generateTexture(prompt);
      onTextureChange(base64Image, 'AI Generated');
    } catch (err: any) {
      setError(err.message || 'Failed to generate texture');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearTexture = () => {
    onTextureChange(null, '');
    setError(null);
  };

  const updateTextureSetting = (key: keyof TextureSettings, value: number) => {
    onTextureSettingsChange({
      ...textureSettings,
      [key]: value
    });
  };

  const updateRotationSetting = (key: keyof RotationSettings, value: any) => {
    onRotationSettingsChange({
      ...rotationSettings,
      [key]: value
    });
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-700 shrink-0">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Box className="w-6 h-6 text-indigo-400" />
          ShapeWrapper
        </h1>
        <p className="text-slate-400 text-xs mt-1">Select a shape and apply a skin.</p>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1">
        {/* Shape Selector */}
        <div className="p-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Shape Base</h2>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => onShapeChange(shape.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                  currentShape === shape.id
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <shape.icon className="w-5 h-5 mb-1.5" />
                <span className="text-[10px] font-medium">{shape.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Controls */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/30">
           <button 
              onClick={() => setShowAnimSettings(!showAnimSettings)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clapperboard className="w-3.5 h-3.5" /> View & Animation
              </h2>
              <span className={`text-[10px] text-indigo-400 transition-transform ${showAnimSettings ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {showAnimSettings && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateRotationSetting('autoRotate', !rotationSettings.autoRotate)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs transition-all ${
                      rotationSettings.autoRotate 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {rotationSettings.autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {rotationSettings.autoRotate ? 'Pause Rotation' : 'Play Rotation'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-500">Speed</label>
                        <span className="text-[10px] text-slate-400">{rotationSettings.speed.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" min="0" max="10" step="0.1" 
                        value={rotationSettings.speed}
                        onChange={(e) => updateRotationSetting('speed', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 block mb-1.5">Direction</label>
                      <div className="flex bg-slate-900 rounded-md p-0.5">
                        <button
                          onClick={() => updateRotationSetting('direction', 1)}
                          className={`flex-1 py-1 flex items-center justify-center rounded text-[10px] transition-colors ${
                             rotationSettings.direction === 1 ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Clockwise"
                        >
                           <RotateCw className="w-3.5 h-3.5" />
                        </button>
                         <button
                          onClick={() => updateRotationSetting('direction', -1)}
                          className={`flex-1 py-1 flex items-center justify-center rounded text-[10px] transition-colors ${
                             rotationSettings.direction === -1 ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Counter Clockwise"
                        >
                           <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            )}
        </div>

        {/* Texture Controls */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Texture Source</h2>
            {textureSource !== 'none' && (
              <button 
                onClick={clearTexture} 
                className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-900 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                activeTab === 'upload' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                activeTab === 'ai' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> AI Gen
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-slate-700/50 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 mb-1 transition-colors" />
                  <p className="text-[10px] text-slate-400">Click to upload image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe texture pattern..."
                className="w-full h-20 bg-slate-900 border border-slate-600 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                  isGenerating || !prompt.trim()
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" /> Generate
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Texture Settings */}
        {textureSource !== 'none' && (
          <div className="p-4 border-t border-slate-700 bg-slate-900/50">
            <button 
              onClick={() => setShowTextureSettings(!showTextureSettings)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> Adjustments
              </h2>
              <span className={`text-[10px] text-indigo-400 transition-transform ${showTextureSettings ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {showTextureSettings && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Scale / Repeat */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Maximize className="w-3 h-3 text-indigo-400" /> 
                    <span>Tiling (Scale)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Horizontal</label>
                      <input 
                        type="range" min="0.1" max="10" step="0.1" 
                        value={textureSettings.repeatX}
                        onChange={(e) => updateTextureSetting('repeatX', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Vertical</label>
                      <input 
                        type="range" min="0.1" max="10" step="0.1" 
                        value={textureSettings.repeatY}
                        onChange={(e) => updateTextureSetting('repeatY', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Offset */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Move className="w-3 h-3 text-indigo-400" /> 
                    <span>Position (Offset)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">X-Axis</label>
                      <input 
                        type="range" min="-1" max="1" step="0.01" 
                        value={textureSettings.offsetX}
                        onChange={(e) => updateTextureSetting('offsetX', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500">Y-Axis</label>
                      <input 
                        type="range" min="-1" max="1" step="0.01" 
                        value={textureSettings.offsetY}
                        onChange={(e) => updateTextureSetting('offsetY', parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <RotateCw className="w-3 h-3 text-indigo-400" /> 
                    <span>Rotation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" min="0" max="6.28" step="0.1" 
                      value={textureSettings.rotation}
                      onChange={(e) => updateTextureSetting('rotation', parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[10px] text-slate-500 w-8 text-right">
                      {Math.round(textureSettings.rotation * (180/Math.PI))}°
                    </span>
                  </div>
                </div>

                 <button 
                  onClick={() => onTextureSettingsChange({ offsetX: 0, offsetY: 0, repeatX: 1, repeatY: 1, rotation: Math.PI })}
                  className="w-full py-1.5 text-[10px] font-medium text-slate-400 bg-slate-800 rounded hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Reset Adjustments
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;