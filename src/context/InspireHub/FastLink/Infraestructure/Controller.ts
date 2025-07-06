import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTurnstile } from 'react-turnstile';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { addLoading, removeLoading } from '../../../shared/Infraestructure/SliceGeneric';
import { UseCaseCreateShortLink } from '../Aplication/UseCaseCreateShortLink';
import { IFormCreateShortLinkValues } from '../Domain/IFormCreateShortLink';
import { IResponseServiceCreateShortLink } from '../Domain/IServiceCreateShortLink';
import { PropsView } from '../Domain/PropsView';
import { RepositoryImplMain } from './RepositoryImplMain';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const dispatch: Dispatch = useDispatch();
  const { dbLocal } = useSelector((state: RootState) => state.generic);
  const repository: RepositoryImplMain = new RepositoryImplMain(dbLocal, dispatch);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalURL, setOriginalURL] = useState('');
  const [shortURL, setShortURL] = useState('');
  const turnstile = useTurnstile();
  //#endregion

  //#Recaptcha
  const [recaptcha, setRecaptcha] = useState('');

  const onChangeRecaptcha = (recaptcha: string) => {
    setRecaptcha(recaptcha);
  };
  //#endregion

  //#region INICIALITATION
  const init = async () => {
    console.log('INICIO');
  };

  const end = async () => {
    console.log('FIN');
  };
  //#endregion

  //#region FUNCIONES
  const onCopy = () => {
    if (shortURL) {
      navigator.clipboard
        .writeText(shortURL)
        .then(() => {
          AdapterGeneric.createToast({ message: 'Link copied to clipboard', icon: 'success' });
        })
        .catch(() => {
          AdapterGeneric.createToast({ message: 'Failed to copy the link', icon: 'error' });
        });
    }
  };

  const onNewShorten = () => {
    formCreateShortLink.resetForm();
    setShortURL('');
    setOriginalURL('');
  };

  const onViewStats = () => {
    if (shortURL) {
      window.open(shortURL, '_blank'); // Asume que tienes una ruta para ver las estadísticas
    } else {
      AdapterGeneric.createToast({ message: 'No link available to view', icon: 'error' });
    }
  };

  //#endregion

  //#region FORM CREATE SHORTLINK
  const formCreateShortLink = useFormik<IFormCreateShortLinkValues>({
    initialValues: {
      link: '',
    },
    validationSchema: Yup.object({
      link: Yup.string().required('Enter your URL here. Example: https://example.com').url('Invalid URL. Please enter a valid URL: https://example.com'),
    }),

    onSubmit: () => {},
  });

  const onChangeValueCreateShortLink = <T extends keyof IFormCreateShortLinkValues>(name: T, value: IFormCreateShortLinkValues[T]) => {
    if (value === null) return;
    formCreateShortLink.setFieldValue(name, value);
  };

  const onSubmitCreateShortLink = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);

      await formCreateShortLink.submitForm();
      try {
        AdapterValidator.validate(await formCreateShortLink.validateForm());
      } catch {
        return;
      }

      if (!recaptcha) throw new Error('Not valid captcha');

      dispatch(addLoading('Loading...'));
      const resp: IResponseServiceCreateShortLink = await new UseCaseCreateShortLink(repository).exec({ originalLink: encodeURIComponent(formCreateShortLink.values.link), captcha: encodeURIComponent(recaptcha) });
      turnstile.reset();
      onChangeRecaptcha('');
      setShortURL(resp.shortLink);
      setOriginalURL(resp.originalLink);
      dispatch(removeLoading());
      formCreateShortLink.resetForm();
    } catch (error) {
      dispatch(removeLoading());
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
      // alert((error as Error).message, { okButtonText: 'Ok' });
      // AdapterGeneric.createMessage('Alerta', (error as Error).message, 'warning', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  //#endregion

  //#region EXPORT
  return {
    end,
    formCreateShortLink,
    init,
    isSubmitting,
    onChangeValueCreateShortLink,
    onCopy,
    onSubmitCreateShortLink,
    originalURL,
    shortURL,
    onNewShorten,
    onViewStats,
    onChangeRecaptcha,
  };
  //#endregion
};
