import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import IncidentPage from './pages/IncidentPage';
import OperationPage from './pages/OperationPage';
import AnalyzePage from './pages/AnalyzePage';
import ManagementPage from './pages/ManagementPage';
import SettingPage from './pages/SettingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'ban-do',
        element: <MapPage />,
      },
      {
        path: 'van-hanh',
        element: <OperationPage />,
      },
      {
        path: 'su-co',
        element: <IncidentPage />,
      },
      {
        path: 'phan-tich',
        element: < AnalyzePage/>,
      },
      {
        path: 'quan-ly',
        element: <ManagementPage />,
      },
      {
        path: 'cai-dat',
        element: <SettingPage />,
      },

    //   {
    //     path: 'su-co',
    //     element: <IncidentPage />,
    //   },
      // (Sau này thêm các trang khác ở đây, vd: /van-hanh, /su-co...)
    ],
  },
  // (Sau này chúng ta sẽ thêm các trang không có layout ở đây, vd: /login)
]);