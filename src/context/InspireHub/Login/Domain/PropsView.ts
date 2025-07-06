import { IFormLoginTouched, IFormLoginValues } from './IFormLogin';

export interface PropsView {
  end: () => void;
  formLogin: { values: IFormLoginValues; touched: any; errors: any; handleBlur: (name: keyof IFormLoginTouched) => void };
  init: () => void;
  isSubmitting: boolean;
  onChangeRecaptcha: (recaptcha: string) => void;
  onChangeValueLogin: <T extends keyof IFormLoginValues>(name: T, value: IFormLoginValues[T]) => void;
  onSubmitLogin: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmitLoginGithub: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmitLoginGoogle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  recaptcha: string;
}
