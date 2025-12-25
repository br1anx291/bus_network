import React, { createContext, useContext, useState, useEffect } from 'react';
import notificationService from '~/services/notificationService';
import pb from '~/api/pocketbase';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const defaultSettings = {
    doNotDisturb: false,
    app_notification: true, 
    alerts: {},
    technical: {}
  };

  const [settings, setSettings] = useState(null); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const fetchNotificationData = async () => {
    if (!pb.authStore.isValid) {
      return;
    }

    try {
      const dataFromDB = await notificationService.getSettings();
      const mergedSettings = { ...defaultSettings, ...(dataFromDB || {}) };
      setSettings(mergedSettings);

      if (!mergedSettings.doNotDisturb) {
        const result = await notificationService.getNotifications(1, 5);
    
        setUnreadCount(result.totalItems || 0); 
        setNotifications(result.items || []);  
      } else {
        setUnreadCount(0);
        setNotifications([]);
      }

    } catch (error) {
      console.error('Lỗi fetch data:', error);
    }
  };

  useEffect(() => {
    fetchNotificationData();
    const unsubscribe = pb.authStore.onChange(() => {
      fetchNotificationData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const updateSettings = async (newSettings) => {
    const previousSettings = settings;
    setSettings(newSettings);

    if (newSettings.doNotDisturb) {
      setUnreadCount(0);
    }

    try {
      await notificationService.updateSettings(newSettings);
    } catch (error) {
      console.error('Lỗi lưu setting:', error);
      setSettings(previousSettings);
      throw error; 
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotificationData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        settings, 
        unreadCount, 
        notifications,
        updateSettings,
        markAsRead, 
        refreshData: fetchNotificationData 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);