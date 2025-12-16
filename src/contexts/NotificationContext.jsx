// src/contexts/NotificationContext.jsx
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
// [NEW] Thêm state lưu danh sách thông báo thực tế
  const [notifications, setNotifications] = useState([]);

  // --- 1. FETCH DATA (Giữ nguyên) ---
  const fetchNotificationData = async () => {
    if (!pb.authStore.isValid) {
      return;
    }

    try {
      const dataFromDB = await notificationService.getSettings();
      const mergedSettings = { ...defaultSettings, ...(dataFromDB || {}) };
      setSettings(mergedSettings);

      if (!mergedSettings.doNotDisturb) {
        // [UPDATE] Lấy 5 thông báo mới nhất để hiển thị ra Popup
        const result = await notificationService.getNotifications(1, 5);
        
        setUnreadCount(result.totalItems || 0); // Tổng số chưa đọc
        setNotifications(result.items || []);   // [NEW] Lưu danh sách tin nhắn
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

  // --- 2. UPDATE SETTINGS (SỬA LẠI ĐOẠN NÀY) ---
  const updateSettings = async (newSettings) => {
    // A. Lưu lại state cũ để backup (Revert logic)
    const previousSettings = settings;

    // B. Cập nhật UI ngay lập tức (Optimistic Update)
    setSettings(newSettings);

    if (newSettings.doNotDisturb) {
      setUnreadCount(0);
    }

    try {
      // C. Gọi API
      await notificationService.updateSettings(newSettings);
      
      // Thành công thì không cần làm gì thêm, UI đã update ở bước B rồi.

    } catch (error) {
      console.error('Lỗi lưu setting:', error);

      // D. [QUAN TRỌNG] Nếu lỗi -> Hoàn tác lại state cũ
      setSettings(previousSettings);
      
      // E. [BẮT BUỘC] Ném lỗi ra ngoài để NotificationSettings.jsx bắt được
      // Nếu không có dòng này, bên kia sẽ tưởng là thành công.
      throw error; 
    }
  };

  // --- 3. MARK READ (Giữ nguyên) ---
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