import { useEffect } from 'react';
import { Controller } from './Infraestructure/Controller';
import { ViewMain } from './UI/View';
import ErrorBoundary from '../context/shared/UI/ErrorBoundary';

const ManagerEntity = () => {
  const controller = Controller();

  useEffect(() => {
    controller.init();
    return () => {
      controller.end();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ViewMain />
    </ErrorBoundary>
  );
};

export default ManagerEntity;
