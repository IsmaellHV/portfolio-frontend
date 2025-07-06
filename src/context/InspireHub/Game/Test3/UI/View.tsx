import { Sphere } from './Sphere';
import './Style.scss';
import { ThreeScene } from './ThreeScene';
import { OrbitControls, Stars } from '@react-three/drei';

export const View = () => {
  return (
    <div className="ViewGameTest3 m-5 outline-color-red">
      <h3 className="color-primary-300">Test - Sphere</h3>
      <div className="game-container ">
        <ThreeScene>
          <color attach="background" args={['#161c24']} />
          <Sphere color="yellow" position={[-3, 0, 0]} />
          <Sphere color="red" position={[0, 0, 0]} />
          <Sphere color="green" position={[3, 0, 0]} />
          <ambientLight intensity={1} />
          <OrbitControls autoRotate />
          <Stars count={1000} factor={4} />
        </ThreeScene>
      </div>
    </div>
  );
};
