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
      // document.body.classList.remove('rs-theme-dark');
      // document.body.classList.add('rs-theme-light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      // document.body.classList.remove('rs-theme-light');
      // document.body.classList.add('rs-theme-dark');
    }
  }, [themeLight]);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const masterHeader = document.querySelector('.master-header');
      const currentScroll = window.scrollY;

      if (!masterHeader) return;

      if (currentScroll > lastScrollTop) {
        masterHeader.classList.add('block');
      } else {
        masterHeader.classList.remove('block');
      }
      if (currentScroll > 0) {
        masterHeader.classList.add('shadow');
      } else {
        masterHeader.classList.remove('shadow');
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
