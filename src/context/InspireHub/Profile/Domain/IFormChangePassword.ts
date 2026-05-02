export interface IFormChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type IFormChangePasswordTouched = {
  [key in keyof IFormChangePasswordValues]?: boolean;
};

export type IFormChangePasswordError = {
  [key in keyof IFormChangePasswordValues]?: boolean;
};
