import { faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { Dispatch } from 'redux';
import { Button, Drawer } from 'rsuite';
import { ENVIRONMENT } from '../../../../../env';
import { IconMenu } from '../../../../shared/Icons';
import { RootState } from '../../../../shared/Infraestructure/AdapterStore';
import { setToggleTheme } from '../../../../shared/Infraestructure/SliceGeneric';
import { setLanguage } from '../../../../shared/Infraestructure/SliceLanguage';
import { Logo } from '../Logo/View';
import './Style.scss';

export const NavBar = () => {
  const { themeLight } = useSelector((state: RootState) => state.generic);
  const language = useSelector((state: RootState) => state.language);
  const dispatch: Dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate: NavigateFunction = useNavigate();

  const handleOpenMenu = () => {
    setOpen(true);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const onToggleTheme = async () => {
    const value = !themeLight;
    dispatch(setToggleTheme(value));
  };

  const onToggleLanguage = () => {
    const newLang = language.code === 'en' ? 'es' : 'en';
    dispatch(setLanguage(newLang));
  };

  const handleGo = (route: string) => {
    navigate(route, { replace: true });
    setOpen(false);
  };

  const handleClickResumen = () => {
    window.open(language.code === 'en' ? 'cv/english.pdf' : 'cv/spanish.pdf', '_blank');
  };

  return (
    <>
      {/* NAV BAR */}
      <nav className="master-navbar" aria-label="Master navigation">
        <Logo onClick={handleGoHome} />
        <div className="nav-items">
          <Link title={language.global.home} href={ENVIRONMENT.ROUTE.MASTERHOME} className="cursor-pointer" to={ENVIRONMENT.ROUTE.MASTERHOME} spy={true} smooth={true} hashSpy={true} activeClass="active">
            {language.global.home}
          </Link>
          <Link title={language.global.about} href={'/' + ENVIRONMENT.ROUTE.MASTERABOUT} className="cursor-pointer" to={ENVIRONMENT.ROUTE.MASTERABOUT} spy={true} smooth={true} hashSpy={true} activeClass="active">
            {language.global.about}
          </Link>
          <Link title={language.global.contact} href={ENVIRONMENT.ROUTE.MASTERCONTACT} className="cursor-pointer" to={ENVIRONMENT.ROUTE.MASTERCONTACT} spy={true} smooth={true} hashSpy={true} activeClass="active">
            {language.global.contact}
          </Link>
          <Link title={language.global.inspireHub} href={ENVIRONMENT.ROUTE.INSPIREHUBHOME} className="cursor-pointer" to={ENVIRONMENT.ROUTE.INSPIREHUBHOME} spy={true} smooth={true} hashSpy={true} activeClass="active" onClick={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBHOME)}>
            {language.global.inspireHub}
          </Link>
          <div className="language-toggle" onClick={onToggleLanguage} title={language.global.switchLanguage}>
            {language.code.toUpperCase()}
          </div>
          <div className={`theme-toggle ${themeLight ? 'light' : 'dark'}`} onClick={onToggleTheme} title={language.global.switchTheme}>
            <div className="toggle-inner">{themeLight ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faMoon} />}</div>
          </div>
          <div className="btn-resumen">
            <Button className="btn-animation-shadow" title={language.global.resume} onClick={() => handleClickResumen()}>
              {language.global.resume}
            </Button>
          </div>
        </div>
        <IconMenu onClick={handleOpenMenu} className="icon" />
      </nav>

      {/* MENU RESPONSIVE */}
      <Drawer className="master-drawer" size="xs" open={open} onClose={() => setOpen(false)} closeButton={true} placement="right" autoFocus={true} backdrop="static">
        <Drawer.Body>
          <div className="master-drawer-body">
            <div className="language-toggle" onClick={onToggleLanguage} title={language.global.switchLanguage}>
              {language.code.toUpperCase()}
            </div>
            <div className={`theme-toggle ${themeLight ? 'light' : 'dark'}`} onClick={onToggleTheme} title="Change theme">
              <div className="toggle-inner">{themeLight ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faMoon} />}</div>
            </div>
            <Link href={ENVIRONMENT.ROUTE.MASTERHOME} className="cursor-pointer fs-15 m-15 text-break" to={ENVIRONMENT.ROUTE.MASTERHOME} spy={true} smooth={true} hashSpy={true} activeClass="active">
              {language.global.home}
            </Link>
            <Link href={ENVIRONMENT.ROUTE.MASTERABOUT} className="cursor-pointer fs-15 m-15 text-break" to={ENVIRONMENT.ROUTE.MASTERABOUT} spy={true} smooth={true} hashSpy={true} activeClass="active">
              {language.global.about}
            </Link>
            <Link href={ENVIRONMENT.ROUTE.MASTERCONTACT} className="cursor-pointer fs-15 m-15 text-break" to={ENVIRONMENT.ROUTE.MASTERCONTACT} spy={true} smooth={true} hashSpy={true} activeClass="active">
              {language.global.contact}
            </Link>
            <Link href={ENVIRONMENT.ROUTE.INSPIREHUBHOME} className="cursor-pointer fs-15 m-15 text-break" to={ENVIRONMENT.ROUTE.INSPIREHUBHOME} spy={true} smooth={true} hashSpy={true} activeClass="active" onClick={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBHOME)}>
              {language.global.inspireHub}
            </Link>
            <div className="btn-resumen">
              <Button className="btn-animation-shadow" title="Check out my Inspire Hub!" onClick={() => handleClickResumen()}>
                {language.global.resume}
              </Button>
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
