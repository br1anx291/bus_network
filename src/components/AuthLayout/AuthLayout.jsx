import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
  return (
    <div className={styles.authContainer}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;