import React from 'react';
import { Controller } from './Infraestructure/Controller';
import View from './UI/View';

const Games2048: React.FC = () => {
  const controller = Controller();

  return <View controller={controller} />;
};

export default Games2048;