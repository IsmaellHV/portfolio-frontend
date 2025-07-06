import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../../context/shared/Infraestructure/AdapterStore';
import { ENVIRONMENT } from '../../../env';

interface Props {
  element: JSX.Element;
  privateContent?: boolean;
}

export const AuthGuardInspireHub = ({ element, privateContent }: Props) => {
  const { auth } = useSelector((state: RootState) => state.authInspireHub);
  return privateContent ? (
    auth ? ( //auth
      element
    ) : (
      <Navigate replace to={`${ENVIRONMENT.ROUTE.INSPIREHUBLOGIN}`} />
    )
  ) : auth ? (
    <Navigate replace to={`${ENVIRONMENT.ROUTE.INSPIREHUBHOME}`} />
  ) : (
    element
  );
};
