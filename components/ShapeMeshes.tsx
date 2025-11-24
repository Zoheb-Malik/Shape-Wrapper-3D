import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { ShapeType, TextureSettings } from '../types';

interface ShapeProps {
  textureUrl: string | null;
  textureSettings: TextureSettings;
}

// Reusable material setup with settings
const useTextureMaterial = (url: string | null, settings: TextureSettings) => {
  const texture = useLoader(THREE.TextureLoader, url || 'https://picsum.photos/200/200'); 
  
  // Apply settings to the texture instance whenever settings change
  useEffect(() => {
    if (!url) return;
    
    // Set wrapping to Repeat so we can offset/tile
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    
    // Apply transformations
    texture.offset.set(settings.offsetX, settings.offsetY);
    texture.repeat.set(settings.repeatX, settings.repeatY);
    texture.center.set(0.5, 0.5); // Rotate around center
    texture.rotation = settings.rotation;
    
    // Ensure correct color space interpretation for uploaded/generated images
    texture.colorSpace = THREE.SRGBColorSpace;
    
    // Notify Three.js that the texture properties have updated
    texture.needsUpdate = true;
  }, [texture, url, settings]);

  const material = useMemo(() => {
    if (!url) {
      return new THREE.MeshStandardMaterial({ 
        color: '#6366f1', 
        roughness: 0.3, 
        metalness: 0.1 
      });
    }
    return new THREE.MeshStandardMaterial({ 
      map: texture, 
      roughness: 0.4, // Reduced glossiness to make texture colors more visible
      metalness: 0.1,
      side: THREE.DoubleSide
    });
  }, [url, texture]);

  return material;
};

export const CubeShape: React.FC<ShapeProps> = ({ textureUrl, textureSettings }) => {
  const material = useTextureMaterial(textureUrl, textureSettings);
  return (
    <mesh material={material}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
    </mesh>
  );
};

export const SphereShape: React.FC<ShapeProps> = ({ textureUrl, textureSettings }) => {
  const material = useTextureMaterial(textureUrl, textureSettings);
  return (
    <mesh material={material}>
      <sphereGeometry args={[1.8, 64, 64]} />
    </mesh>
  );
};

export const PyramidShape: React.FC<ShapeProps> = ({ textureUrl, textureSettings }) => {
  const material = useTextureMaterial(textureUrl, textureSettings);
  return (
    <mesh material={material}>
      <coneGeometry args={[2, 3, 4]} />
    </mesh>
  );
};

export const TorusShape: React.FC<ShapeProps> = ({ textureUrl, textureSettings }) => {
  const material = useTextureMaterial(textureUrl, textureSettings);
  return (
    <mesh material={material}>
      <torusGeometry args={[1.5, 0.6, 64, 100]} />
    </mesh>
  );
};

export const IcosahedronShape: React.FC<ShapeProps> = ({ textureUrl, textureSettings }) => {
  const material = useTextureMaterial(textureUrl, textureSettings);
  return (
    <mesh material={material}>
      <icosahedronGeometry args={[2, 0]} />
    </mesh>
  );
};

export const HeartShape: React.FC<ShapeProps> = ({ textureUrl, textureSettings }) => {
  const material = useTextureMaterial(textureUrl, textureSettings);
  
  const geometry = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.2, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };

    const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geo.center();
    geo.rotateZ(Math.PI);
    geo.rotateX(Math.PI);
    
    // UV Mapping Fix for Extruded Geometry to better support wrapping
    const posAttribute = geo.attributes.position;
    const uvAttribute = geo.attributes.uv;
    
    if (posAttribute && uvAttribute) {
       // Re-calculate UVs roughly based on position to ensure texture isn't just stretched
       for (let i = 0; i < posAttribute.count; i++) {
         const x = posAttribute.getX(i);
         const y = posAttribute.getY(i);
         // Simple box mapping logic or planar
         uvAttribute.setXY(i, (x / 3) + 0.5, (y / 3) + 0.5);
       }
       uvAttribute.needsUpdate = true;
    }

    return geo;
  }, []);

  return <mesh geometry={geometry} material={material} rotation={[Math.PI, 0, 0]} scale={1.5} />;
};

export const ShapeRenderer: React.FC<{ type: ShapeType; textureUrl: string | null; textureSettings: TextureSettings }> = ({ type, textureUrl, textureSettings }) => {
  switch (type) {
    case ShapeType.CUBE: return <CubeShape textureUrl={textureUrl} textureSettings={textureSettings} />;
    case ShapeType.SPHERE: return <SphereShape textureUrl={textureUrl} textureSettings={textureSettings} />;
    case ShapeType.PYRAMID: return <PyramidShape textureUrl={textureUrl} textureSettings={textureSettings} />;
    case ShapeType.TORUS: return <TorusShape textureUrl={textureUrl} textureSettings={textureSettings} />;
    case ShapeType.HEART: return <HeartShape textureUrl={textureUrl} textureSettings={textureSettings} />;
    case ShapeType.ICOSAHEDRON: return <IcosahedronShape textureUrl={textureUrl} textureSettings={textureSettings} />;
    default: return <CubeShape textureUrl={textureUrl} textureSettings={textureSettings} />;
  }
};