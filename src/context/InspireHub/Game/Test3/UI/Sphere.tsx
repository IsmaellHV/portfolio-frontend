interface Props {
  color: string;
  position: [number, number, number];
}

export const Sphere = ({ color, position }: Props) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  );
};
