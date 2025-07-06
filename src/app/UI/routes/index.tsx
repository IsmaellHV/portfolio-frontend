import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import InspireHubFastLink from '../../../context/InspireHub/FastLink';
import InspireHubGames from '../../../context/InspireHub/Games';
import InspireHubGamesSnake from '../../../context/InspireHub/GamesSnake';
import InspireHubGamesTetris from '../../../context/InspireHub/GamesTetris';
import InspireHubHome from '../../../context/InspireHub/Home';
import InspireHubLogin from '../../../context/InspireHub/Login';
import InspireHubMain from '../../../context/InspireHub/Main';
import MasterContact from '../../../context/Master/Contact';
// import { LoaderApp } from '../../../context/shared/Components/Element/LoaderApp/View';
import { LoaderPage } from '../../../context/shared/Components/Element/LoaderPage/View';
import { Page404 } from '../../../context/shared/Components/UI/Page404/View';
import { ENVIRONMENT } from '../../../env';
import { AuthGuardInspireHub } from './AuthGuardInspireHub';
import { LoaderLazy } from '@/Components/Element/LoaderLazy/View';
const MasterMain = lazy(() => import('../../../context/Master/Main'));
const MasterHome = lazy(() => import('../../../context/Master/Home'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoaderLazy />}>
      <BrowserRouter>
        {/* <LoaderLazy /> */}
        {/* <LoaderApp /> */}
        <LoaderPage />
        <Toaster richColors />
        <Routes>
          {/* <Route path="*" element={<Navigate to='/404' replace />} /> */}
          <Route path="*" element={<Page404 />} />
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="#home" element={<Navigate to="/" replace />} />
          <Route element={<MasterMain />}>
            <Route path={ENVIRONMENT.ROUTE.MASTER} element={<MasterHome />} />
            <Route path={ENVIRONMENT.ROUTE.MASTERHOME} element={<Navigate to={ENVIRONMENT.ROUTE.MASTER} replace />} />
            <Route path={ENVIRONMENT.ROUTE.MASTERCONTACT} element={<MasterContact />} />
          </Route>
          <Route element={<InspireHubMain />}>
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUB} element={<InspireHubHome />} />
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUBHOME} element={<Navigate to={ENVIRONMENT.ROUTE.INSPIREHUB} replace />} />
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUBLOGIN} element={<AuthGuardInspireHub element={<InspireHubLogin />} privateContent={false} />} />
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUBFASTLINK} element={<InspireHubFastLink />} />
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUBGAMES} element={<InspireHubGames />} />
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUBGAMESTETRIS} element={<InspireHubGamesTetris />} />
            <Route path={ENVIRONMENT.ROUTE.INSPIREHUBGAMESSNAKE} element={<InspireHubGamesSnake />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};
