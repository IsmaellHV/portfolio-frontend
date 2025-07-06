export interface IFormCreateShortLinkValues {
  link: string;
}

export type IFormCreateShortLinkTouched = {
  [key in keyof IFormCreateShortLinkValues]?: boolean;
};

export type IFormCreateShortLinkError = {
  [key in keyof IFormCreateShortLinkValues]?: boolean;
};
