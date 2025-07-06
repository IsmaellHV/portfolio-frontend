import { faGamepad, faHouse, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Nav, Sidenav } from 'rsuite';
import { ENVIRONMENT } from '../../../../../env';
import { IconLogo } from '../../../../shared/Icons';
import { RootState } from '../../../../shared/Infraestructure/AdapterStore';
import './Style.scss';

interface PropsView {
  activeKey: string;
  openKeys: (string | number)[];
  onOpenChange: (openKeys: (string | number)[], event: React.SyntheticEvent) => void;
  onSelect: (activeKey: string) => void;
  expanded: boolean;
  onExpanded: (expanded: boolean) => void;
  appearance: 'default' | 'inverse' | 'subtle';
}

export const SideNav = (props: PropsView) => {
  const navigate: NavigateFunction = useNavigate();
  const language = useSelector((state: RootState) => state.language);

  const handleGo = (route: string) => {
    navigate(route, { replace: true });
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  // const onToggleTheme = async () => {
  //   const value = !themeLight;
  //   dispatch(setToggleTheme(value));
  // };

  return (
    <div className="inspireHub-sideNav">
      <Sidenav appearance={props.appearance} expanded={props.expanded} openKeys={props.openKeys} onOpenChange={props.onOpenChange}>
        <Sidenav.Header>
          <div onClick={() => handleGoHome()} className="sideNav-header">
            <IconLogo className="icon-header" />
            {props.expanded && <span className="nav-items text-break">{language.global.inspireHub}</span>}
          </div>
        </Sidenav.Header>
        <Sidenav.Body>
          <Nav activeKey={props.activeKey} onSelect={props.onSelect}>
            {/* <div className={`theme-toggle ${themeLight ? 'light' : 'dark'}`} onClick={onToggleTheme} title="Cambiar tema">
              <div className="toggle-inner">{themeLight ? <i className="fa-regular fa-lightbulb"></i> : <i className="fa-solid fa-moon"></i>}</div>
            </div> */}
            <Nav.Item eventKey="1" icon={<FontAwesomeIcon icon={faHouse} className="sideNav-icon" />} onSelect={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBHOME)}>
              {language.global.home}
            </Nav.Item>
            <Nav.Item eventKey="2" icon={<FontAwesomeIcon icon={faLink} className="sideNav-icon" />} onSelect={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBFASTLINK)}>
              Fast Link
            </Nav.Item>
            <Nav.Menu placement="rightStart" eventKey="3" title="Games" icon={<FontAwesomeIcon icon={faGamepad} className="sideNav-icon" />}>
              <Nav.Item eventKey="3.1" onSelect={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBGAMES)}>
                {language.global.home}
              </Nav.Item>
              <Nav.Item eventKey="3-2" onSelect={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBGAMESTETRIS)}>
                Tetris
              </Nav.Item>
              <Nav.Item eventKey="3-3" onSelect={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBGAMESSNAKE)}>
                Snake
              </Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle onToggle={props.onExpanded} />
      </Sidenav>
    </div>
  );
};

{
  /* <Nav.Menu eventKey="5" title="Games" icon={<i className="sideNav-icon fa-solid fa-gamepad"></i>}>
              <Nav.Item eventKey="5-1">Tetris</Nav.Item>
            </Nav.Menu> */
}
{
  /* <Nav.Menu eventKey="4" title="Settings" icon={<GearCircleIcon />}>
              <Nav.Item eventKey="4-1">Applications</Nav.Item>
              <Nav.Item eventKey="4-2">Channels</Nav.Item>
              <Nav.Item eventKey="4-3">Versions</Nav.Item>
              <Nav.Menu eventKey="4-5" title="Custom Action">
                <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
              </Nav.Menu>
            </Nav.Menu> */
}
