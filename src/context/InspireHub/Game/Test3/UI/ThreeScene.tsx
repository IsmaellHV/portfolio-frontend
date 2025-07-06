import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface ThreeSceneProps {
  children: ReactNode;
}

export const ThreeScene = ({ children }: ThreeSceneProps) => {
  return <Canvas>{children}</Canvas>;
};
