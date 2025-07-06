import { ITranslate, TypeLanguage } from '../Domain/ILanguage';

export const AdapterLanguage: { [key in TypeLanguage]: ITranslate } = {
  es: {
    code: 'es',
    global: {
      name: 'PORTAFOLIO',
      selectLanguage: 'Seleccionar Idioma',
      languageSpanish: 'Español',
      languageEnglish: 'Inglés',
      switchLanguage: 'Cambiar a inglés',
      home: 'Inicio',
      about: 'Sobre mí',
      contact: 'Contacto',
      inspireHub: 'Inspira Lab',
      resume: 'Resumen',
      switchTheme: 'Cambiar tema',
    },
    listLanguage: [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'Inglés' },
    ],
    masterHome: {
      title: 'Hola, mi nombre es',
      name: 'Ismael Hurtado',
      description: `
      <span>Soy un <span class="color-primary-400">desarrollador de software</span> con más <span class="fw-700">de 7 años de experiencia</span></span>.
      <span>Especializado en desarrollo backend y creación de aplicaciones potenciadas por IA.</span>
      `,
      buttonInspireHub: '¡Inspira Lab!',
    },
    masterAbout: {
      title: 'Sobre mí',
      description: `
      <p>¡Hola! Mi nombre es Ismael. Disfruto crear soluciones que mejoran la vida de las personas mientras amplío los límites de lo posible.</p>  
      <p>Me encanta combinar la IA con tecnologías robustas de backend para abordar desafíos reales, y estoy constantemente explorando nuevas herramientas para mantenerme a la vanguardia.</p>  
      <p>Siempre en busca de oportunidades para aprender, crecer y expandir mis habilidades.</p>  
      <p>Estas son algunas tecnologías con las que he trabajado recientemente:</p>        `,
    },
    masterContact: {
      title: 'Contáctate',
      myPersonalInfo: 'Mi Información Personal',
      name: 'Nombre',
      email: 'Correo Electrónico',
      location: 'Ubicación',
      contactMe: 'Contáctame',
      message: 'Mensaje',
      sendMessage: 'Enviar Mensaje',
      placeholderName: 'Ingrese su nombre aquí',
      placeholderEmail: 'Ingrese su correo electrónico aquí',
      placeholderMessage: 'Ingrese su mensaje aquí',
      validateRequiredName: 'El nombre es requerido',
      validateRequiredEmail: 'El correo electrónico es requerido',
      validateFormatEmailEmal: 'El correo electrónico es inválido',
      validateRequiredMessage: 'El mensaje es requerido',
    },
    masterFooter: {
      descriptionDesign: 'Diseño inspirado por',
      descriptionDevelopment: 'Desarrollo',
      descriptionBuild: 'y construido por',
      descriptionCopyright: 'Copyright',
      descriptionLicense: 'Licenciado bajo',
    },
  },
  en: {
    code: 'en',
    global: {
      name: 'PORTFLOLIO',
      selectLanguage: 'Select Language',
      languageSpanish: 'Spanish',
      languageEnglish: 'English',
      switchLanguage: 'Switch to Spanish',
      home: 'Home',
      about: 'About me',
      contact: 'Contact',
      inspireHub: 'Inspire Hub',
      resume: 'Resume',
      switchTheme: 'Switch theme',
    },
    listLanguage: [
      { code: 'es', name: 'Spanish' },
      { code: 'en', name: 'English' },
    ],
    masterHome: {
      title: 'Hi, my name is',
      name: 'Ismael Hurtado',
      description: `
      <span>I'm a <span class="color-primary-400">software developer</span> with over <span class="fw-700">7 years of experience</span></span>.
      <span>Specializing in backend development and the creation of AI-powered applications.</span>
      `,
      buttonInspireHub: 'Inspire Hub!',
    },
    masterAbout: {
      title: 'About me',
      description: `
      <p>Hello! My name is Ismael. I enjoy building solutions that improve people's lives while pushing the boundaries of what's possible.</p>
      <p>I love combining AI with powerful backend technologies to tackle real challenges, and I'm constantly exploring new tools to stay on the cutting edge.</p>
      <p>I'm curious and open-minded, always seeking fresh opportunities to learn, grow, and expand my skill set.</p>
      <p>Here are a few techwwnologies I've been working with recently:</p>
      `,
    },
    masterContact: {
      title: 'Get In Touch',
      myPersonalInfo: 'My Personal Info',
      name: 'Name',
      email: 'Email',
      location: 'Location',
      contactMe: 'Contact me',
      message: 'Message',
      sendMessage: 'Send Message',
      placeholderName: 'Enter your name here',
      placeholderEmail: 'Enter your email here',
      placeholderMessage: 'Enter your message here',
      validateRequiredName: 'Name is required',
      validateRequiredEmail: 'Email is required',
      validateFormatEmailEmal: 'Email is invalid',
      validateRequiredMessage: 'Message is required',
    },
    masterFooter: {
      descriptionDesign: 'Design inspired by',
      descriptionDevelopment: 'Development',
      descriptionBuild: 'and built by',
      descriptionCopyright: 'Copyright',
      descriptionLicense: 'Licensed under',
    },
  },
};
