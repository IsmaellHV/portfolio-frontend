import './Style.scss';
import { grid } from 'ldrs';

export const LoaderLazy = () => {
  grid.register();

  return (
    <div className="loaderLazy">
      <l-grid size="60" speed="2.5" color={'#64ffda'}></l-grid>
    </div>
  );
};

// Default values shown
