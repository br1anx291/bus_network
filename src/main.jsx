import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';
import './styles/global.css';
import 'antd/dist/reset.css';
import { NotificationProvider } from '~/contexts/NotificationContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </NotificationProvider>
);