import { IFormCreateShortLinkError, IFormCreateShortLinkValues } from './IFormCreateShortLink';

export interface PropsView {
  end: () => void;
  formCreateShortLink: { values: IFormCreateShortLinkValues; touched: any; errors: any; handleBlur: (name: keyof IFormCreateShortLinkError) => void };
  init: () => void;
  isSubmitting: boolean;
  onChangeRecaptcha: (recaptcha: string) => void;
  onChangeValueCreateShortLink: <T extends keyof IFormCreateShortLinkValues>(name: T, value: IFormCreateShortLinkValues[T]) => void;
  onCopy: () => void;
  onNewShorten: () => void;
  onSubmitCreateShortLink: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => void;
  onViewStats: () => void;
  originalURL: string;
  shortURL: string;
}
