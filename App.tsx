import React, { useState, Suspense } from 'react';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { AppPhase } from './types';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.OFFERING);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas Layer */}
      <Suspense fallback={<div className="text-white absolute center">Loading Light...</div>}>
        <Scene phase={phase} setPhase={setPhase} />
      </Suspense>

      {/* HTML/Text Layer */}
      <UIOverlay phase={phase} />

      {/* Subtle Logo/Credit in Corner */}
      <div className="absolute bottom-4 right-6 z-20 opacity-30 pointer-events-none">
        <span className="font-serif-luxury text-xs text-white tracking-widest">LUMINA</span>
      </div>
    </div>
  );
};

export default App;