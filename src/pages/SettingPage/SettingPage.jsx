// src/pages/SettingPage/SettingPage.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Tabs } from 'antd'; 
// 1. Import useLocation để nhận "tín hiệu"
import { useLocation } from 'react-router-dom';
import styles from './SettingPage.module.css';

import ProfileSettings from '~/features/settings/components/ProfileSettings';
import SecuritySettings from '~/features/settings/components/SecuritySettings';
import NotificationSettings from '~/features/settings/components/NotificationSettings';

const { Title } = Typography;

const tabItems = [
  { key: 'profile', label: 'Hồ sơ cá nhân', children: <ProfileSettings /> },
  { key: 'security', label: 'Bảo mật', children: <SecuritySettings /> },
  { key: 'notifications', label: 'Thông báo', children: <NotificationSettings /> },
];

const SettingPage = () => {
  const location = useLocation();
  
  // 2. Dùng state để quản lý Tab đang mở
  const [activeTab, setActiveTab] = useState('profile');

  // 3. Lắng nghe sự thay đổi của location
  useEffect(() => {
    // Nếu có state "activeTab" được gửi tới (từ Header)
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]); // Chạy lại mỗi khi state thay đổi

  // 4. Hàm xử lý khi người dùng bấm chuyển Tab thủ công
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className={styles.pageContainer}>
      <Title level={2} className={styles.pageTitle}>
        Cài đặt
      </Title>
      <Tabs 
        activeKey={activeTab} // 5. Điều khiển Tab bằng state
        onChange={handleTabChange} // 6. Cập nhật state khi bấm
        items={tabItems} 
        className={styles.settingTabs}
      />
    </div>
  );
};

export default SettingPage;