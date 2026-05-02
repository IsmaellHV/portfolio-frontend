import { IFormChangePasswordTouched, IFormChangePasswordValues } from './IFormChangePassword';

export interface PropsView {
  end: () => void;
  init: () => void;
  isSubmitting: boolean;
  formChangePassword: {
    values: IFormChangePasswordValues;
    touched: any;
    errors: any;
    handleBlur: (name: keyof IFormChangePasswordTouched) => void;
  };
  onChangeValueChangePassword: <T extends keyof IFormChangePasswordValues>(name: T, value: IFormChangePasswordValues[T]) => void;
  onSubmitChangePassword: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  onSignOut: () => void;
  user: { email?: string; displayName?: string; role?: string; provider?: string } | null;
}
