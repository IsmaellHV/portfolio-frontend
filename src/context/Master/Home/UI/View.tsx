import { faCloudflare, faDigitalOcean, faDocker, faGithub, faJs, faLinkedinIn, faNodeJs, faPython, faReact, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button, Divider, Panel, Stack } from 'rsuite';
import { useState } from 'react';
import photo from '../../../../assets/img/profile.webp';
import { ENVIRONMENT } from '../../../../env';
import { InputForm } from '../../../shared/Components/Element/InputForm/View';
import { Recaptcha } from '../../../shared/Components/Element/Recaptcha/View';
import { SocialPill } from '../../../shared/Components/Element/SocialPill/View';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

// Sample projects data
const sampleProjects = [
  {
    title: 'E-commerce Platform',
    description: 'Una plataforma de comercio electrónico completa con carrito de compras, pagos y gestión de inventario.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20website%20interface%20clean%20design%20shopping%20cart%20product%20grid&image_size=landscape_4_3',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    demoUrl: 'https://demo-ecommerce.example.com',
    codeUrl: 'https://github.com/example/ecommerce-platform'
  },
  {
    title: 'Task Management App',
    description: 'Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real y seguimiento de proyectos.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=task%20management%20dashboard%20kanban%20board%20modern%20ui%20productivity%20app&image_size=landscape_4_3',
    technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
    demoUrl: 'https://demo-taskmanager.example.com',
    codeUrl: 'https://github.com/example/task-manager'
  },
  {
    title: 'Weather Dashboard',
    description: 'Dashboard meteorológico con pronósticos detallados, mapas interactivos y alertas personalizadas.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=weather%20dashboard%20interface%20charts%20maps%20forecast%20modern%20design&image_size=landscape_4_3',
    technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
    demoUrl: 'https://demo-weather.example.com',
    codeUrl: 'https://github.com/example/weather-dashboard'
  },
  {
    title: 'Social Media Analytics',
    description: 'Herramienta de análisis de redes sociales con métricas avanzadas y reportes automatizados.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=social%20media%20analytics%20dashboard%20charts%20graphs%20data%20visualization&image_size=landscape_4_3',
    technologies: ['Angular', 'Python', 'D3.js', 'Redis'],
    demoUrl: 'https://demo-analytics.example.com',
    codeUrl: 'https://github.com/example/social-analytics'
  }
];

export const View = (props: PropsView) => {
  const navigate: NavigateFunction = useNavigate();
  const language = useSelector((state: RootState) => state.language);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
            {!imageLoaded && !imageError && (
              <div 
                style={{ 
                  width: 160, 
                  height: 160, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-light-300)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-background)'
                }}
              >
                Cargando...
              </div>
            )}
            <img 
              src={photo} 
              alt="Foto de perfil de Ismael Hurtado" 
              width={160} 
              height={160}
              style={{ 
                borderRadius: '50%', 
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none'
              }}
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
            {imageError && (
              <div 
                style={{ 
                  width: 160, 
                  height: 160, 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-light-300)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--color-background)',
                  fontSize: '12px'
                }}
              >
                Error al cargar imagen
              </div>
            )}
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

      {/* PROJECTS */}
      <section id="projects" className="projects">
        <div className="projects__container">
          <div className="projects__header">
            <h2 className="projects__title">{language.masterProjects.title}</h2>
            <p className="projects__description">{language.masterProjects.description}</p>
          </div>
          
          <div className="projects__grid">
            {sampleProjects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-card__image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-card__overlay">
                    <div className="project-card__actions">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                        {language.masterProjects.viewProject}
                      </a>
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                        {language.masterProjects.viewCode}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="project-card__content">
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__description">{project.description}</p>
                  <div className="project-card__technologies">
                    <span className="technologies-label">{language.masterProjects.technologies}:</span>
                    <div className="technologies-list">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="technology-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
