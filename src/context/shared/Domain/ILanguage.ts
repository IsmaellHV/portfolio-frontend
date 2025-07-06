export type TypeLanguage = 'es' | 'en';

export interface ILanguage {
  code: TypeLanguage;
  name: string;
}
export interface ITranslate {
  code: TypeLanguage;
  listLanguage: ILanguage[];
  global: IGlobal;
  masterHome: IMasterHome;
  masterAbout: IMasterAbout;
  masterContact: IMasterContact;
  masterFooter: IMasterFooter;
}

interface IGlobal {
  name: string;
  selectLanguage: string;
  switchLanguage: string;
  languageSpanish: string;
  languageEnglish: string;
  home: string;
  about: string;
  contact: string;
  inspireHub: string;
  resume: string;
  switchTheme: string;
}

interface IMasterHome {
  title: string;
  name: string;
  description: string;
  buttonInspireHub: string;
}

interface IMasterAbout {
  title: string;
  description: string;
}

interface IMasterContact {
  title: string;
  myPersonalInfo: string;
  name: string;
  email: string;
  location: string;
  contactMe: string;
  message: string;
  sendMessage: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderMessage: string;
  validateRequiredName: string;
  validateRequiredEmail: string;
  validateFormatEmailEmal: string;
  validateRequiredMessage: string;
}

interface IMasterFooter {
  descriptionDesign: string;
  descriptionDevelopment: string;
  descriptionBuild: string;
  descriptionCopyright: string;
  descriptionLicense: string;
}
