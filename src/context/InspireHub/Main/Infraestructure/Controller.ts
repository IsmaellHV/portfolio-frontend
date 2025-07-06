import { useEffect } from 'react';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { PropsView } from '../Domain/PropsView';
import { useSelector } from 'react-redux';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const { themeLight } = useSelector((state: RootState) => state.generic);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (themeLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [themeLight]);
  //#endregion

  //#region INICIALITATION
  const init = async () => {};

  const end = async () => {};
  //#endregion

  //#region EXPORT
  return {
    init,
    end,
  };
  //#endregion
};
