import { faCloudflare, faDigitalOcean, faDocker, faGithub, faJs, faLinkedinIn, faNodeJs, faPython, faReact, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Divider, Image, Panel, Stack } from 'rsuite';
import photo from '../../../../assets/img/profile.webp';
import { ENVIRONMENT } from '../../../../env';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { Recaptcha } from '../../../shared/Components/Element/Recaptcha/View';
import { SocialPill } from '../../../shared/Components/Element/SocialPill/View';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

export const View = (props: PropsView) => {
  const navigate: NavigateFunction = useNavigate();
  const language = useSelector((state: RootState) => state.language);

  const handleGo = (route: string) => {
    navigate(route, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>{ENVIRONMENT.APP.TITLE}</title>
        <meta name="description" content={ENVIRONMENT.META.DESCRIPTION} />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.MASTER}`} />
      </Helmet>

      {/* SOCIAL MEDIA */}
      <aside className="social-icons">
        <ul>
          <li>
            <a
              title="Linkedin"
              href={ENVIRONMENT.META.IN_URL}
              target="_blank"
              rel="noopener noreferrer"
              // onClick={() => handleClick('Linkedin')}
            >
              <FontAwesomeIcon icon={faLinkedinIn} className="social-icon-item" />
            </a>
          </li>

          <li>
            <a
              title="Twitter"
              href={ENVIRONMENT.META.TW_URL}
              target="_blank"
              rel="noopener noreferrer"
              //  onClick={() => handleClick('X')}
            >
              <FontAwesomeIcon icon={faXTwitter} className="social-icon-item" />
            </a>
          </li>

          <li>
            <a
              title="Git Hub"
              href={ENVIRONMENT.META.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              // onClick={() => handleClick('GitHub')}
            >
              <FontAwesomeIcon icon={faGithub} className="social-icon-item" />
            </a>
          </li>
        </ul>
      </aside>

      {/* CONTACT MAIL */}
      <aside className="contact-mail">
        <ul>
          <li>
            <a
              className="contact-mail-item"
              title="Email"
              href="mailto:ismaelhv@outlook.com"
              target="_blank"
              rel="noopener noreferrer"
              //  onClick={() => handleClick('Email')}
            >
              {ENVIRONMENT.INFO.MAIL}
            </a>
          </li>
        </ul>
      </aside>

      {/* HOME */}
      <section id="home" className="master-home">
        <section className="info">
          <header className="title text-break">
            <span>{language.masterHome.title}</span>
          </header>
          <section>
            <h1 className="name text-break">{ENVIRONMENT.INFO.NAME}</h1>
            <h2 className="description-secondary fw-400 " dangerouslySetInnerHTML={{ __html: language.masterHome.description || '' }}></h2>
            <nav className="social-pills ">
              <SocialPill title={'Linkedin'} href={ENVIRONMENT.META.IN_URL}>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </SocialPill>
              <SocialPill title={'Twitter'} href={ENVIRONMENT.META.TW_URL}>
                <FontAwesomeIcon icon={faXTwitter} />
              </SocialPill>
              <SocialPill title={'Github'} href={ENVIRONMENT.META.GITHUB_URL}>
                <FontAwesomeIcon icon={faGithub} />
              </SocialPill>
              <SocialPill title={ENVIRONMENT.INFO.MAIL} href={'mailto:' + ENVIRONMENT.INFO.MAIL}>
                <FontAwesomeIcon icon={faEnvelope} />
              </SocialPill>
            </nav>
            <Button className="btn-animation-shadow text-break" title={language.masterHome.buttonInspireHub} onClick={() => handleGo(ENVIRONMENT.ROUTE.INSPIREHUB)}>
              {language.masterHome.buttonInspireHub}
            </Button>
          </section>
        </section>
      </section>

      {/* ABOUT */}
      <section id="about" className="master-about">
        <header className="title">
          <span>{language.global.about}</span>
        </header>
        <section className="info">
          <div>
            <div className="description fw-400 mb-10" dangerouslySetInnerHTML={{ __html: language.masterAbout.description || '' }}></div>
            <nav className="social-pills">
              <SocialPill title={'Node.js'} href="#">
                <FontAwesomeIcon icon={faNodeJs} />
              </SocialPill>
              <SocialPill title={'JavaScript'} href="#">
                <FontAwesomeIcon icon={faJs} />
              </SocialPill>
              <SocialPill title={'React'} href="#">
                <FontAwesomeIcon icon={faReact} />
              </SocialPill>
              <SocialPill title={'Python'} href="#">
                <FontAwesomeIcon icon={faPython} />
              </SocialPill>
              <SocialPill title={'Cloudflare'} href="#">
                <FontAwesomeIcon icon={faCloudflare} />
              </SocialPill>
              <SocialPill title={'DigitalOcean'} href="#">
                <FontAwesomeIcon icon={faDigitalOcean} />
              </SocialPill>
              <SocialPill title={'Docker'} href="#">
                <FontAwesomeIcon icon={faDocker} />
              </SocialPill>
              <SocialPill title={'Github'} href="#">
                <FontAwesomeIcon icon={faGithub} />
              </SocialPill>
            </nav>
          </div>

          <div className="photo">
            <Image circle src={photo} alt="Foto de perfil de Ismael Hurtado" width={160} />
          </div>
        </section>
      </section>

      {/* CONTACT */}
      <section id="contact" className="master-contact">
        <section className="info">
          <header className="title">
            <span>{language.masterContact.title}</span>
          </header>
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

      {/* FOOTER */}
      <footer id="footer" className="master-footer">
        <span>
          {language.masterFooter.descriptionDesign}
          <a href="https://v4.brittanychiang.com/" target="_blank" rel="noopener noreferrer">
            &nbsp;Brittany Chiang
          </a>{' '}
          {language.masterFooter.descriptionDevelopment}{' '}
          <a href={ENVIRONMENT.INFO.URL} target="_blank" rel="noopener noreferrer">
            {ENVIRONMENT.INFO.NAME}
          </a>
        </span>
      </footer>
    </>
  );
};
