import { faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { Dispatch } from 'redux';
import { Avatar, Badge, Dropdown } from 'rsuite';
import { ENVIRONMENT } from '../../../../../env';
import { AdapterGeneric } from '../../../../shared/Infraestructure/AdapterGeneric';
import { RootState } from '../../../../shared/Infraestructure/AdapterStore';
import { AdapterSupabase } from '../../../../shared/Infraestructure/AdapterSupabase';
import { setUser, signOut } from '../../../../shared/Infraestructure/SliceAuthInspireHub';
import { addLoading, removeLoading, setToggleTheme } from '../../../../shared/Infraestructure/SliceGeneric';
import { setLanguage } from '../../../../shared/Infraestructure/SliceLanguage';
import './Style.scss';

export const NavBar = () => {
  const { themeLight } = useSelector((state: RootState) => state.generic);
  const language = useSelector((state: RootState) => state.language);
  const { auth, user } = useSelector((state: RootState) => state.authInspireHub);
  const dispatch: Dispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    AdapterSupabase.getUser().then((respUser: User | null) => {
      console.log({ respUser });

      dispatch(setUser({ user: !respUser?.id ? null : respUser }));
    });
  }, []);

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
  };

  const renderToggle = (props: any) => {
    return (
      <Badge content="0">
        <Avatar //avatar
          {...props}
          size="sm"
          circle
          src={user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150'}
        />
      </Badge>
    );
  };

  const logout = async () => {
    try {
      dispatch(addLoading('Logging out...'));
      await AdapterSupabase.signOut();
      dispatch(signOut());
      AdapterGeneric.createToast({ message: 'Signed out', icon: 'success' });
    } catch (error) {
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      dispatch(removeLoading());
    }
  };

  return (
    <>
      {/* NAV BAR */}
      <nav className="inspireHub-navbar">
        <div className="nav-items">
          <Link href={ENVIRONMENT.ROUTE.MASTER} className="cursor-pointer" to={ENVIRONMENT.ROUTE.MASTER} spy={true} smooth={true} hashSpy={true} activeClass="active" onClick={() => handleGo(ENVIRONMENT.ROUTE.MASTER)}>
            {language.global.home}
          </Link>

          <div className="language-toggle" onClick={onToggleLanguage} title={language.global.switchLanguage}>
            {language.code.toUpperCase()}
          </div>
          <div className={`theme-toggle ${themeLight ? 'light' : 'dark'}`} onClick={onToggleTheme} title={language.global.switchTheme}>
            <div className="toggle-inner">{themeLight ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faMoon} />}</div>
          </div>
          {!auth ? (
            <div className="login-button">
              <Link href={ENVIRONMENT.ROUTE.INSPIREHUBLOGIN} className="cursor-pointer" to={ENVIRONMENT.ROUTE.INSPIREHUBLOGIN} spy={true} smooth={true} hashSpy={true} activeClass="active" onClick={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUBLOGIN)}>
                Login
              </Link>
            </div>
          ) : (
            <div className="user-dropdown">
              <Dropdown placement="bottomEnd" size="xs" trigger="click" toggleAs="div" renderToggle={renderToggle}>
                <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
                  <p>Signed in as</p>
                  <div className="text-break fw-700">
                    <span title={user?.email}>{user?.email}</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item>Your profile</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
