import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Dispatch } from 'redux';
import * as Yup from 'yup';
import { ENVIRONMENT } from '../../../../env';
import { AdapterAuth } from '../../../shared/Infraestructure/AdapterAuth';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { signOut } from '../../../shared/Infraestructure/SliceAuthInspireHub';
import { addLoading, removeLoading } from '../../../shared/Infraestructure/SliceGeneric';
import { IFormChangePasswordValues } from '../Domain/IFormChangePassword';
import { PropsView } from '../Domain/PropsView';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch: Dispatch = useDispatch();
  const { dbLocal } = useSelector((state: RootState) => state.generic);
  const { user } = useSelector((state: RootState) => state.authInspireHub);
  const repository = AdapterAuth.buildRepository(dbLocal, dispatch);
  const navigate: NavigateFunction = useNavigate();
  //#endregion

  //#region INIT
  const init = async () => {};
  const end = async () => {};
  //#endregion

  //#region FORM CHANGE PASSWORD
  const formChangePassword = useFormik<IFormChangePasswordValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Enter your current password').max(100, 'Max 100 characters'),
      newPassword: Yup.string()
        .required('Enter a new password')
        .min(8, 'Min 8 characters')
        .max(100, 'Max 100 characters')
        .notOneOf([Yup.ref('currentPassword')], 'New password must differ from current'),
      confirmPassword: Yup.string()
        .required('Confirm your new password')
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match'),
    }),
    onSubmit: () => {},
  });

  const onChangeValueChangePassword = <T extends keyof IFormChangePasswordValues>(name: T, value: IFormChangePasswordValues[T]) => {
    if (value === null) return;
    formChangePassword.setFieldValue(name, value);
  };

  const onSubmitChangePassword = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);

      await formChangePassword.submitForm();
      try {
        AdapterValidator.validate(await formChangePassword.validateForm());
      } catch (error) {
        AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
        return;
      }

      dispatch(addLoading('Loading...'));
      await AdapterAuth.changePassword(repository, {
        currentPassword: formChangePassword.values.currentPassword,
        newPassword: formChangePassword.values.newPassword,
      });

      AdapterGeneric.createToast({ message: 'Contraseña actualizada', icon: 'success' });
      formChangePassword.resetForm();
      dispatch(removeLoading());
    } catch (error) {
      dispatch(removeLoading());
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  //#endregion

  //#region SIGN OUT
  const onSignOut = async () => {
    try {
      await AdapterAuth.signOut(repository);
      dispatch(signOut());
      navigate(ENVIRONMENT.ROUTE.INSPIREHUB, { replace: true });
    } catch (error) {
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    }
  };
  //#endregion

  //#region EXPORT
  return {
    init,
    end,
    isSubmitting,
    formChangePassword,
    onChangeValueChangePassword,
    onSubmitChangePassword,
    onSignOut,
    user,
  };
  //#endregion
};
