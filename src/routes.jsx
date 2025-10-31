import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import IncidentPage from './pages/IncidentPage';
// (Sau này bạn sẽ import các trang khác ở đây)

export const router = createBrowserRouter([
  {
    // Đây là layout chung (có Sidebar + Header)
    path: '/',
    element: <MainLayout />,
    children: [
      // Khi người dùng vào trang chủ '/', hiển thị DashboardPage
      {
        index: true, // index: true nghĩa là trang mặc định
        element: <DashboardPage />,
      },
      // Khi người dùng vào '/ban-do', hiển thị MapPage
      {
        path: 'ban-do',
        element: <MapPage />,
      },
      {
        path: 'su-co',
        element: <IncidentPage />,
      }
    //   {
    //     path: 'su-co',
    //     element: <IncidentPage />,
    //   },
      // (Sau này thêm các trang khác ở đây, vd: /van-hanh, /su-co...)
    ],
  },
  // (Sau này chúng ta sẽ thêm các trang không có layout ở đây, vd: /login)
]);