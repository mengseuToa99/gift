export enum AppPhase {
  OFFERING = 'OFFERING',   // The Gift Box
  TREE = 'TREE',           // The Particle Tree forming
  EXPLOSION = 'EXPLOSION', // The Physics Explosion
  MESSAGE = 'MESSAGE'      // The Text Reveal
}

export interface ParticleData {
  initial: [number, number, number];
  target: [number, number, number];
  velocity: [number, number, number];
  size: number;
}