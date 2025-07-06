import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTurnstile } from 'react-turnstile';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { addLoading, removeLoading } from '../../../shared/Infraestructure/SliceGeneric';
import { IFormLoginValues } from '../Domain/IFormLogin';
import { PropsView } from '../Domain/PropsView';
import { AdapterSupabase } from '../../../shared/Infraestructure/AdapterSupabase';
import { signIn } from '../../../shared/Infraestructure/SliceAuthInspireHub';
import { ENVIRONMENT } from '../../../../env';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstile = useTurnstile();
  const dispatch: Dispatch = useDispatch();
  //#endregion

  //#Recaptcha
  const [recaptcha, setRecaptcha] = useState('');

  const onChangeRecaptcha = (recaptcha: string) => {
    setRecaptcha(recaptcha);
  };
  //#endregion

  //#region INICIALITATION
  const init = async () => {};

  const end = async () => {};
  //#endregion

  //#region FORM CREATE SHORTLINK
  const formLogin = useFormik<IFormLoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Invalid email').email('Invalid email').max(100, 'Max 100 characters'),
      password: Yup.string().required('Enter your password here').max(100, 'Max 100 characters'),
    }),

    onSubmit: () => {},
  });

  const onChangeValueLogin = <T extends keyof IFormLoginValues>(name: T, value: IFormLoginValues[T]) => {
    if (value === null) return;
    formLogin.setFieldValue(name, value);
  };

  const onSubmitLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);

      await formLogin.submitForm();
      try {
        AdapterValidator.validate(await formLogin.validateForm());
      } catch (error) {
        AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
        return;
      }

      if (!recaptcha) throw new Error('Not valid captcha');

      dispatch(addLoading('Loading...'));
      const { user } = await AdapterSupabase.signInWithPassword(formLogin.values.email, formLogin.values.password);
      dispatch(signIn({ user: user?.id ? user : null }));

      turnstile.reset();
      onChangeRecaptcha('');
      AdapterGeneric.createToast({ message: 'Bienvenido', icon: 'success' });
      formLogin.resetForm();
      dispatch(removeLoading());
    } catch (error) {
      dispatch(removeLoading());
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitLoginGoogle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);

      await formLogin.submitForm();
      try {
        AdapterValidator.validate(await formLogin.validateForm());
      } catch (error) {
        AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
        return;
      }

      if (!recaptcha) throw new Error('Not valid captcha');

      dispatch(addLoading('Loading...'));
      const resp = await AdapterSupabase.signInWithProvider('google', `${window.location.origin}${ENVIRONMENT.ROUTE.INSPIREHUBHOME}`);
      console.log({ resp });
      // const { user } = await AdapterSupabase.signInWithPassword(formLogin.values.email, formLogin.values.password);
      // dispatch(signIn({ user: user?.id ? user : null }));

      turnstile.reset();
      onChangeRecaptcha('');
      AdapterGeneric.createToast({ message: 'Welcome', icon: 'success' });
      formLogin.resetForm();
      dispatch(removeLoading());
    } catch (error) {
      dispatch(removeLoading());
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitLoginGithub = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!recaptcha) throw new Error('Not valid captcha');

      dispatch(addLoading('Loading...'));
      const resp = await AdapterSupabase.signInWithProvider('github', `${window.location.origin}${ENVIRONMENT.ROUTE.INSPIREHUBHOME}`);
      console.log({ resp });
      // dispatch(signIn({ user: data?.id ? user : null }));

      turnstile.reset();
      onChangeRecaptcha('');
      AdapterGeneric.createToast({ message: 'Bienvenido', icon: 'success' });
      formLogin.resetForm();
      dispatch(removeLoading());
    } catch (error) {
      dispatch(removeLoading());
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  //#endregion

  //#region EXPORT
  return {
    init,
    end,
    formLogin,
    isSubmitting,
    onChangeValueLogin,
    onChangeRecaptcha,
    onSubmitLogin,
    onSubmitLoginGoogle,
    onSubmitLoginGithub,
    recaptcha,
  };
  //#endregion
};
