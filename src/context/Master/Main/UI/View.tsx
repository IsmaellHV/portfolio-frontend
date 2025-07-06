import './Style.scss';
import { NavBar } from './NavBar/View';
import { Outlet } from 'react-router-dom';

export const View = () => {
  return (
    <main className="master">
      <header className="master-header">
        <NavBar />
      </header>
      <section className="master-main">
        <Outlet />
      </section>
    </main>
  );
};
