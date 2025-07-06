import './Style.scss';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { SideNav } from './SideNav/View';
import { NavBar } from './NavBar/View';

export const View = () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [openKeys, setOpenKeys] = useState<(string | number)[]>([]);
  const [expanded, setExpanded] = useState(false);

  const handleOpenChange = (openKeys: (string | number)[]) => {
    setOpenKeys(openKeys);
  };

  return (
    <div className="inspireHub">
      <aside className="inspireHub-aside">
        <SideNav activeKey={activeKey} openKeys={openKeys} onOpenChange={handleOpenChange} onSelect={setActiveKey} expanded={expanded} onExpanded={setExpanded} appearance="inverse" />
      </aside>
      <main className="inspireHub-container">
        <header className="inspireHub-header">
          <NavBar />
        </header>
        <section className={`inspireHub-main ${expanded ? 'expanded' : 'collapsed'}`}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};
