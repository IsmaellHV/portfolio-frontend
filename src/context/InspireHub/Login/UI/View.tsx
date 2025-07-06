import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import Turnstile from 'react-turnstile';
import { Button } from 'rsuite';
import { ENVIRONMENT } from '../../../../env';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { IconLogo } from '../../../shared/Icons';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

export const View = (props: PropsView) => {
  const { themeLight } = useSelector((state: RootState) => state.generic);
  const language = useSelector((state: RootState) => state.language);
  const isScreen_480 = useMediaQuery({ maxWidth: 480 });

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Inspire Hub Login" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBLOGIN}`} />
      </Helmet>

      <section className="inspireHub-login">
        <div className="login-box">
          <IconLogo className="icon-header" />

          <InputForm //mail
            xs={24}
            classForm="mb-15"
            type="mail"
            name="email"
            value={props.formLogin.values.email}
            text="Email"
            maxLength={100}
            size="sm"
            upper={false}
            placeholder="Enter your email"
            onChange={props.onChangeValueLogin}
            onBlur={props.formLogin.handleBlur}
            error={props.formLogin.touched.email && props.formLogin.errors.email}
          />

          <InputForm
            xs={24}
            classForm="mb-15"
            type="password"
            name="password"
            value={props.formLogin.values.password}
            text="Password"
            maxLength={100}
            size="sm"
            upper={false}
            placeholder="Enter your password"
            onChange={props.onChangeValueLogin}
            onBlur={props.formLogin.handleBlur}
            error={props.formLogin.touched.password && props.formLogin.errors.password}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') props.onSubmitLogin(e);
            }}
          />

          <Button
            className="btn-animation-shadow mb-10 mt-10"
            disabled={!props.recaptcha || props.isSubmitting}
            loading={props.isSubmitting}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              props.onSubmitLogin(e);
            }}
          >
            Login&nbsp;
            <FontAwesomeIcon icon={faArrowRightToBracket} />
          </Button>

          <p className="register-link">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>

          <div className="social-login">
            <p>Or login with</p>
            <Button
              className="google-btn btn-animation-shadow"
              disabled={!props.recaptcha || props.isSubmitting}
              loading={props.isSubmitting}
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                props.onSubmitLoginGithub(e);
              }}
            >
              <FontAwesomeIcon icon={faGoogle} />
              &nbsp;Google
            </Button>
            <Button
              className="github-btn btn-animation-shadow"
              disabled={!props.recaptcha || props.isSubmitting}
              loading={props.isSubmitting}
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                props.onSubmitLoginGithub(e);
              }}
            >
              <FontAwesomeIcon icon={faGithub} />
              &nbsp;GitHub
            </Button>
          </div>

          <div className="recaptcha">
            <Turnstile
              //Recaptcha
              sitekey={ENVIRONMENT.RECAPTCHA.KEY}
              onVerify={props.onChangeRecaptcha}
              size={isScreen_480 ? 'compact' : 'normal'}
              action="login"
              theme={themeLight ? 'light' : 'dark'}
              language={language.code}
            />
          </div>
        </div>
      </section>
    </>
  );
};
