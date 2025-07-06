export interface IFormLoginValues {
  email: string;
  password: string;
}

export type IFormLoginTouched = {
  [key in keyof IFormLoginValues]?: boolean;
};

export type IFormLoginError = {
  [key in keyof IFormLoginValues]?: boolean;
};
