export interface IFormSignUpValues {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type IFormSignUpTouched = {
  [key in keyof IFormSignUpValues]?: boolean;
};

export type IFormSignUpError = {
  [key in keyof IFormSignUpValues]?: boolean;
};
