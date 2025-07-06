import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { addLoading, removeLoading } from '../../../shared/Infraestructure/SliceGeneric';
import { IFormContactValues } from '../Domain/IFormContact';
import { PropsView } from '../Domain/PropsView';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch: Dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language);

  //#endregion

  //#region INICIALITATION
  const init = async () => {};

  const end = async () => {};
  //#endregion

  //#Recaptcha
  const [recaptcha, setRecaptcha] = useState('');

  const onChangeRecaptcha = (recaptcha: string) => {
    setRecaptcha(recaptcha);
  };
  //#endregion

  //#region FORM CONTACT
  const formContact = useFormik<IFormContactValues>({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(language.masterContact.validateRequiredName).max(100, 'Max 100 characters'),
      email: Yup.string().required(language.masterContact.validateRequiredEmail).email(language.masterContact.validateFormatEmailEmal).max(100, 'Max 100 characters'),
      message: Yup.string().required(language.masterContact.validateRequiredMessage).max(500, 'Max 500 characters'),
    }),

    onSubmit: () => {},
  });

  const onChangeValueContact = <T extends keyof IFormContactValues>(name: T, value: IFormContactValues[T]) => {
    if (value === null) return;
    formContact.setFieldValue(name, value);
  };

  const onSubmitContact = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);
      await formContact.submitForm();
      try {
        AdapterValidator.validate(await formContact.validateForm());
      } catch {
        return;
      }

      if (!recaptcha) throw new Error('Not valid captcha');

      dispatch(addLoading('Loading...'));
      AdapterGeneric.createToast({ message: 'Message sent', icon: 'success' });

      //grabar
      turnstile.reset();
      onChangeRecaptcha('');
      dispatch(removeLoading());
      formContact.resetForm();
    } catch (error) {
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  //#endregion

  //#region EXPORT
  return {
    end,
    formContact,
    init,
    isSubmitting,
    onChangeValueContact,
    onSubmitContact,
    onChangeRecaptcha,
  };
  //#endregion
};
