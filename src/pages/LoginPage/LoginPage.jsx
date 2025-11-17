// src/pages/LoginPage/LoginPage.jsx
import React from 'react';
import { Typography } from 'antd';
import LoginForm from '../../features/auth/components/LoginForm';
import styles from './LoginPage.module.css';
// 1. Import logo (nếu chưa có)
import busLogo from '../../assets/bus-logo.png'; 

const { Title } = Typography;

const LoginPage = () => {
  return (
    <div className={styles.loginPageContainer}>
      {/* CỘT TRÁI (LOGO) */}
      <div className={styles.logoPanel}>
        {/* 2. Thêm thẻ img vào đây */}
        <img src={busLogo} alt="BusNetwork Logo" className={styles.logoImg} />

        <div className={styles.logoTextWrapper}>
          {/* <span className={styles.logoDot}></span> (Nếu bạn vẫn muốn dùng dot) */}
          <Title level={1} className={styles.logoText}>
            BusNetwork
          </Title>
        </div>
      </div>

      {/* CỘT PHẢI (FORM) */}
      <div className={styles.formPanel}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;