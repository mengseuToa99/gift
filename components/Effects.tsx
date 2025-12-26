import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize, Resolution } from 'postprocessing';
import { CONFIG } from '../constants';

export const Effects: React.FC = () => {
  const isMobile = CONFIG.isMobile;
  
  return (
    <EffectComposer disableNormalPass>
      <Bloom 
        intensity={isMobile ? 0.8 : 1.5} 
        luminanceThreshold={0.2} 
        luminanceSmoothing={0.9} 
        kernelSize={isMobile ? KernelSize.SMALL : KernelSize.LARGE} 
        mipmapBlur={!isMobile}
      />
      {!isMobile && <Vignette eskil={false} offset={0.1} darkness={0.5} />}
    </EffectComposer>
  );
};