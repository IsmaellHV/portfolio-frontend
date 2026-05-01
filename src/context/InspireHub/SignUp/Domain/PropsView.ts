import { IFormSignUpTouched, IFormSignUpValues } from './IFormSignUp';

export interface PropsView {
  end: () => void;
  init: () => void;
  isSubmitting: boolean;
  formSignUp: { values: IFormSignUpValues; touched: any; errors: any; handleBlur: (name: keyof IFormSignUpTouched) => void };
  onChangeValueSignUp: <T extends keyof IFormSignUpValues>(name: T, value: IFormSignUpValues[T]) => void;
  onChangeRecaptcha: (recaptcha: string) => void;
  onSubmitSignUp: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  recaptcha: string;
}
