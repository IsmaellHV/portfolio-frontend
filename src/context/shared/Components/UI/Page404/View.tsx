import './Style.scss';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const Page404 = () => {
  const navigate: NavigateFunction = useNavigate();

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="ViewPage404">
      <p className="ViewPage404__text">404. Page not found.</p>
      <button className="ViewPage404__button" onClick={handleGoBack} role="button" aria-label="Go Home">
        Go Home
      </button>
    </div>
  );
};
