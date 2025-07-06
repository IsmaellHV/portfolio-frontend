import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import './Style.scss';

const RotatingMesh = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#64ffda" />
    </mesh>
  );
};

export const View = () => {
  return (
    <div className="ViewGameTest m-30 outline-color-red">
      <h3 className="color-primary-300">Test</h3>
      <div className="game-container">
        <Canvas>
          <ambientLight intensity={1} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <RotatingMesh />
        </Canvas>
      </div>
    </div>
  );
};
