import './Style.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Infraestructure/AdapterStore';
import { useMediaQuery } from 'react-responsive';
import Turnstile from 'react-turnstile';
import { ENVIRONMENT } from '../../../../../env';

interface Props {
  onChangeRecaptcha: (recaptcha: string) => void;
}

export const Recaptcha = ({ onChangeRecaptcha }: Props) => {
  const isScreen_480 = useMediaQuery({ maxWidth: 480 });
  const { themeLight } = useSelector((state: RootState) => state.generic);
  const language = useSelector((state: RootState) => state.language);

  return (
    <Turnstile
      //Recaptcha
      sitekey={ENVIRONMENT.RECAPTCHA.KEY}
      onVerify={onChangeRecaptcha}
      size={isScreen_480 ? 'compact' : 'flexible'}
      appearance="interaction-only"
      action="login"
      theme={themeLight ? 'light' : 'dark'}
      language={language.code}
    />
  );
};
