import { useEffect } from 'react';
import { Controller } from './Infraestructure/Controller';
import { View } from './UI/View';

const ManagerEntity = () => {
  const controller = Controller();

  useEffect(() => {
    controller.init();
    return () => {
      controller.end();
    };
  }, []);

  return <View {...controller} />;
};

export default ManagerEntity;
