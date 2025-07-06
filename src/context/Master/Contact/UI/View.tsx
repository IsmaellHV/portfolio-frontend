import { faGithub, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { Button, Divider, Panel, Stack } from 'rsuite';
import { ENVIRONMENT } from '../../../../env';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { SocialPill } from '../../../shared/Components/Element/SocialPill/View';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';
import { Recaptcha } from '../../../shared/Components/Element/Recaptcha/View';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { useSelector } from 'react-redux';

export const View = (props: PropsView) => {
  const language = useSelector((state: RootState) => state.language);
  return (
    <>
      <Helmet>
        <title>Contact Me</title>
        <meta name="description" content="Personal contact information." />
      </Helmet>

      {/* CONTACT */}
      <section className="master-contacct">
        <section className="info">
          <section>
            <Panel>
              <h3>{language.masterContact.myPersonalInfo}</h3>
              <Stack direction="column" spacing={10}>
                <div>
                  <strong>{language.masterContact.name}:</strong> {ENVIRONMENT.INFO.FULLNAME}
                </div>
                <div>
                  <strong>{language.masterContact.email}:</strong> {ENVIRONMENT.INFO.MAIL}
                </div>
                <div>
                  <strong>{language.masterContact.location}:</strong> {ENVIRONMENT.INFO.LOCATION}
                </div>
              </Stack>
              <Divider />
              <nav className="social-pills">
                <SocialPill title={'Linkedin'} href={ENVIRONMENT.META.IN_URL}>
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </SocialPill>
                <SocialPill title={'Twitter'} href={ENVIRONMENT.META.TW_URL}>
                  <FontAwesomeIcon icon={faXTwitter} />
                </SocialPill>
                <SocialPill title={'Github'} href={ENVIRONMENT.META.GITHUB_URL}>
                  <FontAwesomeIcon icon={faGithub} />
                </SocialPill>
              </nav>
            </Panel>
            <Panel className="contact-panel">
              <h4>{language.masterContact.contactMe}</h4>
              <InputForm
                //Name
                xs={24}
                classForm={'mt-10'}
                type={'text'}
                name={'name'}
                value={props.formContact.values['name']}
                text={language.masterContact.name}
                maxLength={100}
                size={'sm'}
                upper={true}
                placeholder={language.masterContact.placeholderName}
                onChange={props.onChangeValueContact}
                onBlur={props.formContact.handleBlur}
                error={props.formContact.touched['name'] && props.formContact.errors['name']}
              />
              <InputForm
                //Email
                xs={24}
                classForm={'mt-10'}
                type={'text'}
                name={'email'}
                value={props.formContact.values['email']}
                text={language.masterContact.email}
                maxLength={100}
                size={'sm'}
                upper={false}
                placeholder={language.masterContact.placeholderEmail}
                onChange={props.onChangeValueContact}
                onBlur={props.formContact.handleBlur}
                error={props.formContact.touched['email'] && props.formContact.errors['email']}
              />
              <InputForm
                //Message
                xs={24}
                classForm={'mt-10'}
                as={'textarea'}
                rows={4}
                name={'message'}
                value={props.formContact.values['message']}
                text={language.masterContact.message}
                maxLength={500}
                size={'sm'}
                upper={false}
                placeholder={language.masterContact.placeholderMessage}
                onChange={props.onChangeValueContact}
                onBlur={props.formContact.handleBlur}
                error={props.formContact.touched['message'] && props.formContact.errors['message']}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') props.onSubmitContact(e);
                }}
              />
              <Button
                disabled={props.isSubmitting}
                loading={props.isSubmitting}
                className={'mt-20 mb-20 btn-animation-shadow'}
                appearance="ghost"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  props.onSubmitContact(e);
                }}
                style={{ width: '100%' }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="color-primary-300" />
                &nbsp;&nbsp;{language.masterContact.sendMessage}
              </Button>
              <Recaptcha onChangeRecaptcha={props.onChangeRecaptcha} />
            </Panel>
          </section>
        </section>
      </section>
    </>
  );
};
