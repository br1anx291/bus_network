import React from 'react';
import { Typography } from 'antd';
import LoginForm from '../../features/auth/components/LoginForm';
import styles from './LoginPage.module.css';
import busLogo from '../../assets/bus-logo.png'; 

const { Title } = Typography;

const LoginPage = () => {
  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.logoPanel}>
        <img src={busLogo} alt="BusNetwork Logo" className={styles.logoImg} />
        <div className={styles.logoTextWrapper}>
          <Title level={1} className={styles.logoText}>
            BusNetwork
          </Title>
        </div>
      </div>

      <div className={styles.formPanel}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;