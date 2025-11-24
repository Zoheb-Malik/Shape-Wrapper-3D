export enum ShapeType {
  CUBE = 'CUBE',
  SPHERE = 'SPHERE',
  PYRAMID = 'PYRAMID',
  TORUS = 'TORUS',
  HEART = 'HEART',
  ICOSAHEDRON = 'ICOSAHEDRON'
}

export interface TextureState {
  url: string | null;
  name: string;
  source: 'upload' | 'ai' | 'none';
}

export interface TextureSettings {
  offsetX: number;
  offsetY: number;
  repeatX: number;
  repeatY: number;
  rotation: number;
}

export interface RotationSettings {
  autoRotate: boolean;
  speed: number;
  direction: 1 | -1; // 1 or -1 for direction multiplier
}

export interface AppState {
  shape: ShapeType;
  texture: TextureState;
  textureSettings: TextureSettings;
  rotationSettings: RotationSettings;
  isGenerating: boolean;
  error: string | null;
}