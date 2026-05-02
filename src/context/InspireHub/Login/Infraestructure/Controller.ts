import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTurnstile } from 'react-turnstile';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { AdapterAuth } from '../../../shared/Infraestructure/AdapterAuth';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { signIn } from '../../../shared/Infraestructure/SliceAuthInspireHub';
import { addLoading, removeLoading } from '../../../shared/Infraestructure/SliceGeneric';
import { IFormLoginValues } from '../Domain/IFormLogin';
import { PropsView } from '../Domain/PropsView';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstile = useTurnstile();
  const dispatch: Dispatch = useDispatch();
  const { dbLocal } = useSelector((state: RootState) => state.generic);
  const repository = AdapterAuth.buildRepository(dbLocal, dispatch);
  //#endregion

  //#region Captcha
  const [recaptcha, setRecaptcha] = useState('');

  const onChangeRecaptcha = (recaptcha: string) => {
    setRecaptcha(recaptcha);
  };
  //#endregion

  //#region INIT
  const init = async () => {};
  const end = async () => {};
  //#endregion

  //#region FORM LOGIN
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
      const user = await AdapterAuth.signIn(repository, {
        email: formLogin.values.email,
        password: formLogin.values.password,
        captcha: recaptcha,
      });
      dispatch(signIn({ user }));

      AdapterGeneric.createToast({ message: 'Bienvenido', icon: 'success' });
      formLogin.resetForm();
      dispatch(removeLoading());
    } catch (error) {
      dispatch(removeLoading());
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      // Always reset Turnstile — tokens are single-use, so a failed attempt
      // must request a fresh one before the next retry.
      try {
        turnstile?.reset();
      } catch {
        /* noop */
      }
      onChangeRecaptcha('');
      setIsSubmitting(false);
    }
  };

  const oauthStart = (provider: 'google' | 'github') => {
    window.location.href = AdapterAuth.oauthStartUrl(provider);
  };

  const onSubmitLoginGoogle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    oauthStart('google');
  };

  const onSubmitLoginGithub = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    oauthStart('github');
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
