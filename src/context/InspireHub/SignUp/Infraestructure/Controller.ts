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
import { IFormSignUpValues } from '../Domain/IFormSignUp';
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

  //#region FORM SIGNUP
  const formSignUp = useFormik<IFormSignUpValues>({
    initialValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      displayName: Yup.string().required('Enter your name').max(100, 'Max 100 characters'),
      email: Yup.string().required('Invalid email').email('Invalid email').max(100, 'Max 100 characters'),
      password: Yup.string().required('Enter your password here').min(6, 'Min 6 characters').max(100, 'Max 100 characters'),
      confirmPassword: Yup.string()
        .required('Confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords do not match'),
    }),

    onSubmit: () => {},
  });

  const onChangeValueSignUp = <T extends keyof IFormSignUpValues>(name: T, value: IFormSignUpValues[T]) => {
    if (value === null) return;
    formSignUp.setFieldValue(name, value);
  };

  const onSubmitSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);

      await formSignUp.submitForm();
      try {
        AdapterValidator.validate(await formSignUp.validateForm());
      } catch (error) {
        AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
        return;
      }

      if (!recaptcha) throw new Error('Not valid captcha');

      dispatch(addLoading('Loading...'));
      const user = await AdapterAuth.signUp(repository, {
        displayName: formSignUp.values.displayName,
        email: formSignUp.values.email,
        password: formSignUp.values.password,
        captcha: recaptcha,
      });
      dispatch(signIn({ user }));

      AdapterGeneric.createToast({ message: 'Bienvenido', icon: 'success' });
      formSignUp.resetForm();
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
  //#endregion

  //#region EXPORT
  return {
    init,
    end,
    formSignUp,
    isSubmitting,
    onChangeValueSignUp,
    onChangeRecaptcha,
    onSubmitSignUp,
    recaptcha,
  };
  //#endregion
};
