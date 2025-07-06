import './Style.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Infraestructure/AdapterStore';
import { IconLogo } from '../../../Icons';

export const LoaderPage = () => {
  const { loading } = useSelector((state: RootState) => state.generic);

  return (
    <div className={`loaderPage ${!loading && 'hidden'}`}>
      <div className="loader-wrapper">
        {<IconLogo />}
        <span className="loading-text">{loading ? 'Loading...' : ''}</span>
      </div>
    </div>
  );
};
