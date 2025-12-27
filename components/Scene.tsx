import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { GiftBox } from './GiftBox';
import { ParticleTree } from './ParticleTree';
import { Effects } from './Effects';
import { AppPhase } from '../types';
import { CONFIG, COLORS } from '../constants';

interface SceneProps {
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
}

const CameraController = ({ phase }: { phase: AppPhase }) => {
  const vec = useRef(new THREE.Vector3());
  
  useFrame((state) => {
    // Gentle camera drift
    const t = state.clock.getElapsedTime();
    
    let targetZ = CONFIG.cameraPosition[2];
    
    // Zoom out slightly during tree phase
    if (phase === AppPhase.TREE) {
      targetZ = 16;
    }
    // Zoom in slightly during message
    if (phase === AppPhase.MESSAGE) {
      targetZ = 10;
    }

    state.camera.position.lerp(
        vec.current.set(
            Math.sin(t * 0.1) * 2, 
            Math.cos(t * 0.1) * 1, 
            targetZ
        ), 
        0.02
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export const Scene: React.FC<SceneProps> = ({ phase, setPhase }) => {
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [sceneContentReady, setSceneContentReady] = useState(false);
  
  const handleGiftOpen = () => {
    if (phase === AppPhase.OFFERING) {
      setPhase(AppPhase.TREE);
    }
  };

  const handleTreeClick = () => {
    if (phase === AppPhase.TREE) {
      setPhase(AppPhase.EXPLOSION);
    }
  };

  const handleExplosionComplete = () => {
    setPhase(AppPhase.MESSAGE);
  };

  return (
    <>
      {/* Loading overlay - stays in DOM but hidden after initial load to avoid flashing */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#050505',
          opacity: sceneContentReady ? 0 : 1,
          transition: 'opacity 1.2s ease-in',
          pointerEvents: sceneContentReady ? 'none' : 'auto',
          zIndex: 9999,
          willChange: 'opacity',
        }}
      />
      
      <Canvas 
        gl={{ 
          antialias: false, 
          toneMapping: THREE.ReinhardToneMapping, 
          toneMappingExposure: 1.5,
          alpha: true,
          premultipliedAlpha: false
        }}
        dpr={[1, 2]}
        onCreated={(state) => {
          // Mark canvas as ready after a brief delay to ensure first frame is rendered
          setTimeout(() => {
            setIsCanvasReady(true);
          }, 50);
          
          // Mark scene content as ready after longer delay to ensure ALL Stars/Sparkles/lights render
          // Increased to 1200ms to handle large desktop screens
          setTimeout(() => {
            setSceneContentReady(true);
          }, 1200);
        }}
      >
      <PerspectiveCamera makeDefault position={CONFIG.cameraPosition} fov={50} />
      <CameraController phase={phase} />
      
      <color attach="background" args={[COLORS.background]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.warmWhite} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.gold} />

      {/* Environment Dust/Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color={COLORS.champagne} />

      {/* Scene Content */}
      <group>
        {phase === AppPhase.OFFERING && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <GiftBox onOpen={handleGiftOpen} />
          </Float>
        )}

        {phase !== AppPhase.OFFERING && (
          <group onClick={handleTreeClick}>
             <ParticleTree phase={phase} onExplosionComplete={handleExplosionComplete} />
          </group>
        )}
      </group>

      <Effects />
    </Canvas>
    </>
  );
};