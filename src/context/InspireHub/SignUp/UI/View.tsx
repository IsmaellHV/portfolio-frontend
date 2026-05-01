import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import Turnstile from 'react-turnstile';
import { Button } from 'rsuite';
import { ENVIRONMENT } from '../../../../env';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { IconLogo } from '../../../shared/Icons';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

export const View = (props: PropsView) => {

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
        <meta name="description" content="Inspire Hub Sign Up" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBSIGNUP}`} />
      </Helmet>

      <section className="inspireHub-signup">
        <div className="signup-box">
          <IconLogo className="icon-header" />

          <InputForm
            xs={24}
            classForm="mb-15"
            type="text"
            name="displayName"
            value={props.formSignUp.values.displayName}
            text="Name"
            maxLength={100}
            size="sm"
            upper={false}
            placeholder="Enter your name"
            onChange={props.onChangeValueSignUp}
            onBlur={props.formSignUp.handleBlur}
            error={props.formSignUp.touched.displayName && props.formSignUp.errors.displayName}
          />

          <InputForm
            xs={24}
            classForm="mb-15"
            type="mail"
            name="email"
            value={props.formSignUp.values.email}
            text="Email"
            maxLength={100}
            size="sm"
            upper={false}
            placeholder="Enter your email"
            onChange={props.onChangeValueSignUp}
            onBlur={props.formSignUp.handleBlur}
            error={props.formSignUp.touched.email && props.formSignUp.errors.email}
          />

          <InputForm
            xs={24}
            classForm="mb-15"
            type="password"
            name="password"
            value={props.formSignUp.values.password}
            text="Password"
            maxLength={100}
            size="sm"
            upper={false}
            placeholder="Enter your password"
            onChange={props.onChangeValueSignUp}
            onBlur={props.formSignUp.handleBlur}
            error={props.formSignUp.touched.password && props.formSignUp.errors.password}
          />

          <InputForm
            xs={24}
            classForm="mb-15"
            type="password"
            name="confirmPassword"
            value={props.formSignUp.values.confirmPassword}
            text="Confirm Password"
            maxLength={100}
            size="sm"
            upper={false}
            placeholder="Confirm your password"
            onChange={props.onChangeValueSignUp}
            onBlur={props.formSignUp.handleBlur}
            error={props.formSignUp.touched.confirmPassword && props.formSignUp.errors.confirmPassword}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') props.onSubmitSignUp(e);
            }}
          />

          <Button
            className="btn-animation-shadow mb-10 mt-10"
            disabled={!props.recaptcha || props.isSubmitting}
            loading={props.isSubmitting}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              props.onSubmitSignUp(e);
            }}
          >
            Sign Up&nbsp;
            <FontAwesomeIcon icon={faUserPlus} />
          </Button>

          <p className="login-link">
            Already have an account? <a href={ENVIRONMENT.ROUTE.INSPIREHUBLOGIN}>Login</a>
          </p>

          <div className="recaptcha">
            <Turnstile sitekey={ENVIRONMENT.RECAPTCHA.KEY} onVerify={props.onChangeRecaptcha} size="normal" action="submit" />
          </div>
        </div>
      </section>
    </>
  );
};
