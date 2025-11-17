// src/router/routes.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
// --- SỬA LỖI 2: IMPORT ĐÚNG ---
import AuthLayout from '../components/AuthLayout'; 
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import MapPage from '../pages/MapPage/MapPage';
import IncidentPage from '../pages/IncidentPage/IncidentPage';
import VehicleManagementPage from '../pages/VehicleManagementPage/VehicleManagementPage';
import RouteManagementPage from '../pages/RouteManagementPage/RouteManagementPage';
import StationManagementPage from '../pages/StationManagementPage/StationManagementPage';
import TripManagementPage from '../pages/TripManagementPage/TripManagementPage';
import PickupRequestPage from '../pages/PickupRequestPage/PickupRequestPage';
import AnalyzePage from '../pages/AnalyzePage/AnalyzePage';
import SettingPage from '../pages/SettingPage/SettingPage';
import DriverManagementPage from '../pages/DriverManagementPage/DriverManagementPage';
import PassengerManagementPage from '../pages/PassengerManagementPage/PassengerManagementPage';
import AdminManagementPage from '~/pages/AdminManagementPage/AdminManagementPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage'; 
import ForgotPasswordPage from '~/pages/ForgotPasswordPage/ForgotPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  // === LUỒNG 1: MAIN APPLICATION (Có sidebar) ===
  {
    path: '/', // <-- OK, Luồng Main phải là '/'
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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
        element: <Navigate to="/van-hanh/quan-ly-xe" replace />,
      },
      {
        // --- SỬA LỖI 3: BỎ DẤU / Ở ĐẦU ---
        path: 'van-hanh/quan-ly-xe', 
        element: <VehicleManagementPage />,
      },
      {
        path: 'van-hanh/quan-ly-tuyen',
        element: <RouteManagementPage />,
      },
      {
        path: 'van-hanh/quan-ly-tram',
        element: <StationManagementPage />,
      },
      {
        path: 'van-hanh/quan-ly-chuyen',
        element: <TripManagementPage />,
      },
      {
        path: 'van-hanh/yeu-cau-don',
        element: <PickupRequestPage />,
      },      
      {
        path: 'su-co',
        element: <IncidentPage />,
      },
      {
        path: 'phan-tich',
        element: <AnalyzePage />,
      },
      {
        path: 'quan-ly-nguoi-dung',
        element: <Navigate to="/quan-ly-nguoi-dung/tai-xe" replace />,
      },
      {
        path: 'quan-ly-nguoi-dung/tai-xe',
        element: <DriverManagementPage />,
      },
      {
        path: 'quan-ly-nguoi-dung/hanh-khach',
        element: <PassengerManagementPage />,
      },
            {
        path: 'quan-ly-nguoi-dung/admin',
        element: <AdminManagementPage />,
      },
      {
        path: 'cai-dat',
        element: <SettingPage />,
      },
    ],
  },
  
  // === LUỒNG 2: AUTHENTICATION (Không có sidebar) ===
  {
    // --- SỬA LỖI 1: XÓA 'path: "/"' ---
    element: <AuthLayout />, // <-- Chỉ cần element
    children: [
      {
        path: 'login', // Đường dẫn /login
        element: <LoginPage />,
      },
      {
        path: 'register', // Đường dẫn /register
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password', // Đường dẫn /forgot-password
        element: <ForgotPasswordPage />,
      }
    ],
  },
]);