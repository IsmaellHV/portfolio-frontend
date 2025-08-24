import { Controller } from './Infraestructure/Controller';
import { View } from './UI/View';

export const GamesPong = () => {
  const props = Controller();
  return <View {...props} />;
};

export default GamesPong;