// src/pages/RegisterPage/RegisterPage.jsx
import React from 'react';
import { Typography } from 'antd';
import RegisterForm from '../../features/auth/components/RegisterForm';
import styles from './RegisterPage.module.css';
import busLogo from '../../assets/bus-logo.png'; 

const { Title } = Typography; // 3. Lấy Title từ Typography

const RegisterPage = () => {
  return (
    <div className={styles.registerPageContainer}>
      {/* CỘT TRÁI (FORM) */}
      <div className={styles.formPanel}>
        <RegisterForm />
      </div>

      {/* CỘT PHẢI (LOGO) */}
      <div className={styles.logoPanel}>
        <img src={busLogo} alt="BusNetwork Logo" className={styles.logoImg} />
        {/* Nếu muốn thêm chữ "BusNetwork" như login, bạn có thể thêm vào đây */}
        {/* <Title level={1} className={styles.logoText}>BusNetwork</Title> */}
      </div>
    </div>
  );
};

export default RegisterPage;