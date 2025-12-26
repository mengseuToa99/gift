import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferAttribute, AdditiveBlending } from 'three';
import { CONFIG, COLORS } from '../constants';
import { AppPhase } from '../types';

interface ParticleTreeProps {
  phase: AppPhase;
  onExplosionComplete: () => void;
}

export const ParticleTree: React.FC<ParticleTreeProps> = ({ phase, onExplosionComplete }) => {
  const pointsRef = useRef<Points>(null);
  const explosionTimeRef = useRef(0);
  
  // Generate particles
  const particles = useMemo(() => {
    const count = CONFIG.particleCount;
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      // 1. Calculate Target Tree Position (Fibonacci Spiral on a Cone)
      const yNorm = i / count; // 0 to 1 (top to bottom usually, let's invert for tree)
      const y = (1 - yNorm) * CONFIG.treeHeight - (CONFIG.treeHeight / 2); // Center vertically
      
      const radius = yNorm * CONFIG.treeRadius; // Wider at bottom
      const theta = i * goldenAngle;
      
      const tx = radius * Math.cos(theta);
      const tz = radius * Math.sin(theta);
      const ty = y;

      // 2. Initial Position (Collapsed at center/gift box location)
      // Small random cloud at center to avoid z-fighting singularity
      positions[i * 3] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Store Targets
      targetPositions[i * 3] = tx;
      targetPositions[i * 3 + 1] = ty;
      targetPositions[i * 3 + 2] = tz;

      // 3. Calculate Explosion Velocity
      // Vector from center to target, normalized, plus some randomness
      const vx = tx;
      const vy = ty;
      const vz = tz;
      // Simple normalization approximation for direction
      const len = Math.sqrt(vx*vx + vy*vy + vz*vz) || 1;
      velocities[i * 3] = (vx / len) * (0.5 + Math.random() * 0.5) * CONFIG.explosionForce;
      velocities[i * 3 + 1] = (vy / len) * (0.5 + Math.random() * 0.5) * CONFIG.explosionForce;
      velocities[i * 3 + 2] = (vz / len) * (0.5 + Math.random() * 0.5) * CONFIG.explosionForce;
    }

    return { positions, targetPositions, velocities };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as BufferAttribute;
    const currentPositions = posAttr.array as Float32Array;

    // Slow rotation of the tree
    if (phase === AppPhase.TREE) {
      pointsRef.current.rotation.y += delta * 0.1;
    } else if (phase === AppPhase.EXPLOSION || phase === AppPhase.MESSAGE) {
      pointsRef.current.rotation.y += delta * 0.02; // Slower rotation after explosion
    }

    // Logic Loop
    if (phase === AppPhase.TREE) {
      // Lerp particles from Center -> Tree Shape
      const speed = 3.0;
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const idx = i * 3;
        currentPositions[idx] += (particles.targetPositions[idx] - currentPositions[idx]) * speed * delta;
        currentPositions[idx + 1] += (particles.targetPositions[idx + 1] - currentPositions[idx + 1]) * speed * delta;
        currentPositions[idx + 2] += (particles.targetPositions[idx + 2] - currentPositions[idx + 2]) * speed * delta;
      }
      posAttr.needsUpdate = true;

    } else if (phase === AppPhase.EXPLOSION || phase === AppPhase.MESSAGE) {
      // Physics Explosion
      explosionTimeRef.current += delta;
      
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const idx = i * 3;
        // Add velocity
        currentPositions[idx] += particles.velocities[idx];
        currentPositions[idx + 1] += particles.velocities[idx + 1];
        currentPositions[idx + 2] += particles.velocities[idx + 2];
        
        // Optional: Drag/Friction if we wanted them to stop, but prompt says "clears"
        // Let's make them slow down just a tiny bit so they drift beautifully
        particles.velocities[idx] *= 0.98;
        particles.velocities[idx + 1] *= 0.98;
        particles.velocities[idx + 2] *= 0.98;
      }
      posAttr.needsUpdate = true;

      // Trigger text reveal after a short delay
      if (phase === AppPhase.EXPLOSION && explosionTimeRef.current > 1.5) {
        onExplosionComplete();
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={COLORS.gold}
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};