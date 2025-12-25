import React from 'react';
import { Typography } from 'antd';
import RegisterForm from '../../features/auth/components/RegisterForm';
import styles from './RegisterPage.module.css';
import busLogo from '../../assets/bus-logo.png'; 

const { Title } = Typography;

const RegisterPage = () => {
  return (
    <div className={styles.registerPageContainer}>
      <div className={styles.formPanel}>
        <RegisterForm />
      </div>

      <div className={styles.logoPanel}>
        <img src={busLogo} alt="ViaFlow Logo" className={styles.logoImg} />
      </div>
    </div>
  );
};

export default RegisterPage;