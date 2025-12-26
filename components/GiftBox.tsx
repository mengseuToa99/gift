import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { RoundedBox } from '@react-three/drei';
import { COLORS } from '../constants';

interface GiftBoxProps {
  onOpen: () => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ onOpen }) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHover] = useState(false);
  
  // Animation state
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    time.current += delta;
    
    // Floating animation
    groupRef.current.position.y = Math.sin(time.current * 1.5) * 0.2;
    
    // Rotation
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.x = Math.sin(time.current * 0.5) * 0.05;

    // Pulse scale on hover
    const targetScale = hovered ? 1.05 : 1;
    groupRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), delta * 5);
  });

  const boxColor = "#E60000"; // Vibrant Bright Red
  const ribbonColor = "#FFFFFF"; // Pure White

  // Reusable material props for the ribbons (Satin finish)
  const ribbonMaterialProps = {
    color: ribbonColor,
    metalness: 0.3,
    roughness: 0.4,
    emissive: "#CCCCCC",
    emissiveIntensity: 0.1
  };

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setHover(true);
      }}
      onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setHover(false);
      }}
    >
      {/* --- BOX BASE --- */}
      <RoundedBox args={[2, 1.8, 2]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
         <meshStandardMaterial 
            color={boxColor} 
            roughness={0.4} 
            metalness={0.1}
         />
      </RoundedBox>

      {/* --- BOX LID --- */}
      <RoundedBox args={[2.1, 0.4, 2.1]} radius={0.05} smoothness={4} position={[0, 1.0, 0]}>
         <meshStandardMaterial 
            color={boxColor} 
            roughness={0.4} 
            metalness={0.1}
         />
      </RoundedBox>

      {/* --- RIBBONS --- */}
      
      {/* Vertical Ribbon Wrap (Body) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.02, 1.8, 0.35]} />
        <meshStandardMaterial {...ribbonMaterialProps} />
      </mesh>
      {/* Vertical Ribbon Wrap (Lid) */}
       <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[2.12, 0.4, 0.35]} />
        <meshStandardMaterial {...ribbonMaterialProps} />
      </mesh>

      {/* Horizontal Ribbon Wrap (Rotated 90 deg) */}
      <group rotation={[0, Math.PI / 2, 0]}>
         <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.02, 1.8, 0.35]} />
            <meshStandardMaterial {...ribbonMaterialProps} />
         </mesh>
         <mesh position={[0, 1.0, 0]}>
            <boxGeometry args={[2.12, 0.4, 0.35]} />
            <meshStandardMaterial {...ribbonMaterialProps} />
         </mesh>
      </group>

      {/* --- BOW --- */}
      {/* Using a TorusKnot to simulate a complex ribbon knot/bow */}
      <mesh position={[0, 1.35, 0]} rotation={[Math.PI/2, 0, Math.PI/4]} scale={[1, 1, 1.5]}>
         <torusKnotGeometry args={[0.35, 0.12, 64, 8, 2, 3]} />
         <meshStandardMaterial {...ribbonMaterialProps} />
      </mesh>

    </group>
  );
};