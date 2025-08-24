import { Controller } from "./Infraestructure/Controller";
import { View } from "./UI/View";

export const GamesMemory = () => {
  const controller = Controller();
  return <View controller={controller} />;
};

export default GamesMemory;