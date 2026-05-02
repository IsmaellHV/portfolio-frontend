import { faKey, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { Button, Panel } from 'rsuite';
import { ENVIRONMENT } from '../../../../env';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { IconLogo } from '../../../shared/Icons';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

export const View = (props: PropsView) => {
  const isPasswordProvider = props.user?.provider === 'password';

  return (
    <>
      <Helmet>
        <title>Profile</title>
        <meta name="description" content="Inspire Hub Profile" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBPROFILE}`} />
      </Helmet>

      <section className="inspireHub-profile">
        <div className="profile-container">
          <Panel bordered className="profile-card">
            <div className="profile-header">
              <IconLogo className="profile-logo" />
              <FontAwesomeIcon icon={faUserCircle} className="profile-avatar" />
              <h2 className="profile-name">{props.user?.displayName || 'Profile'}</h2>
              <p className="profile-email">{props.user?.email}</p>
              <span className="profile-badge">
                {props.user?.provider} · {props.user?.role}
              </span>
            </div>

            <hr className="profile-sep" />

            <div className="profile-section">
              <h3>
                <FontAwesomeIcon icon={faKey} /> Change password
              </h3>

              {!isPasswordProvider ? (
                <p className="profile-hint">
                  Esta cuenta inició sesión con <strong>{props.user?.provider}</strong>. Cambia la contraseña directamente desde tu proveedor.
                </p>
              ) : (
                <>
                  <InputForm
                    xs={24}
                    classForm="mb-15"
                    type="password"
                    name="currentPassword"
                    value={props.formChangePassword.values.currentPassword}
                    text="Current password"
                    maxLength={100}
                    size="sm"
                    upper={false}
                    placeholder="Enter your current password"
                    onChange={props.onChangeValueChangePassword}
                    onBlur={props.formChangePassword.handleBlur}
                    error={props.formChangePassword.touched.currentPassword && props.formChangePassword.errors.currentPassword}
                  />

                  <InputForm
                    xs={24}
                    classForm="mb-15"
                    type="password"
                    name="newPassword"
                    value={props.formChangePassword.values.newPassword}
                    text="New password"
                    maxLength={100}
                    size="sm"
                    upper={false}
                    placeholder="At least 8 characters"
                    onChange={props.onChangeValueChangePassword}
                    onBlur={props.formChangePassword.handleBlur}
                    error={props.formChangePassword.touched.newPassword && props.formChangePassword.errors.newPassword}
                  />

                  <InputForm
                    xs={24}
                    classForm="mb-15"
                    type="password"
                    name="confirmPassword"
                    value={props.formChangePassword.values.confirmPassword}
                    text="Confirm new password"
                    maxLength={100}
                    size="sm"
                    upper={false}
                    placeholder="Repeat the new password"
                    onChange={props.onChangeValueChangePassword}
                    onBlur={props.formChangePassword.handleBlur}
                    error={props.formChangePassword.touched.confirmPassword && props.formChangePassword.errors.confirmPassword}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') props.onSubmitChangePassword(e);
                    }}
                  />

                  <Button
                    className="btn-animation-shadow mt-10"
                    disabled={props.isSubmitting}
                    loading={props.isSubmitting}
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                      props.onSubmitChangePassword(e);
                    }}
                  >
                    Update password&nbsp;
                    <FontAwesomeIcon icon={faKey} />
                  </Button>
                </>
              )}
            </div>

            <hr className="profile-sep" />

            <div className="profile-section">
              <h3>Session</h3>
              <Button appearance="ghost" className="signout-btn" onClick={props.onSignOut}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                &nbsp;Sign out
              </Button>
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
};
