export interface IFormContactValues {
  name: string;
  email: string;
  message: string;
}

export type IFormContactouched = {
  [key in keyof IFormContactValues]?: boolean;
};

export type IFormContactError = {
  [key in keyof IFormContactValues]?: boolean;
};
