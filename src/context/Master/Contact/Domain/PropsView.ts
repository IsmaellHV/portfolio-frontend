import { IFormContactError, IFormContactValues } from './IFormContact';

export interface PropsView {
  end: () => void;
  init: () => void;
  formContact: { values: IFormContactValues; touched: any; errors: any; handleBlur: (name: keyof IFormContactError) => void };
  isSubmitting: boolean;
  onChangeValueContact: <T extends keyof IFormContactValues>(name: T, value: IFormContactValues[T]) => void;
  onSubmitContact: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeRecaptcha: (recaptcha: string) => void;
}
