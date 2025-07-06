import { useEffect } from 'react';
import { Controller } from './Infraestructure/Controller';
import { ViewMain } from './UI/View';

const ManagerEntity = () => {
  const controller = Controller();

  useEffect(() => {
    controller.init();
    return () => {
      controller.end();
    };
  }, []);

  return <ViewMain />;
};

export default ManagerEntity;
