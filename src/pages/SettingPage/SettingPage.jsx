import React, { useState, useEffect } from 'react';
import { Typography, Tabs } from 'antd'; 
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
  
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className={styles.pageContainer}>
      <Title level={2} className={styles.pageTitle}>
        Cài đặt
      </Title>
      <Tabs 
        activeKey={activeTab}
        onChange={handleTabChange} 
        items={tabItems} 
        className={styles.settingTabs}
      />
    </div>
  );
};

export default SettingPage;