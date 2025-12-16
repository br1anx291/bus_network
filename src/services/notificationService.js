// src/services/notificationService.js
import pb from '~/api/pocketbase';

const notificationService = {
  getSettings: async () => {
    const userId = pb.authStore.model?.id;
    if (!userId) return null;

    const record = await pb.collection('users').getOne(userId, {
      fields: 'notification_settings' 
    });

    return record.notification_settings; 
  },

  updateSettings: async (newSettings) => {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    return await pb.collection('users').update(userId, {
      notification_settings: newSettings
    });
  },

  /**
   * 3. Lấy danh sách thông báo (cho cái chuông)
   * Giả sử bạn có collection tên là 'notifications' lưu lịch sử thông báo
   */
  getNotifications: async (page = 1, perPage = 10) => {
    const userId = pb.authStore.model?.id;
    
    // getList trả về object: { page, perPage, totalItems, items: [...] }
    return await pb.collection('notifications').getList(page, perPage, {
      filter: `users = "${userId}"`, // Lọc thông báo của user này (check lại tên field user trong DB của bạn)
      sort: '-time',                // Mới nhất lên đầu
    });
  },
  
  /**
   * 4. Đánh dấu đã đọc
   * Update field 'is_read' (hoặc tên field tương tự trong DB của bạn)
   */
  markAsRead: async (notificationId) => {
    return await pb.collection('notifications').update(notificationId, {
      is_read: true 
    });
  },

  /**
   * 5. (Tùy chọn) Đăng ký nhận thông báo Realtime
   * PocketBase hỗ trợ realtime cực mạnh, cái này dùng để cập nhật chuông ngay lập tức
   */
  subscribeToNotifications: (callback) => {
    // Đăng ký lắng nghe thay đổi trên collection 'notifications'
    return pb.collection('notifications').subscribe('*', (e) => {
        // e.action: 'create', 'update', ...
        // e.record: dữ liệu thông báo mới
        if (e.action === 'create') {
            callback(e.record);
        }
    });
  },

  unsubscribeNotifications: () => {
    return pb.collection('notifications').unsubscribe();
  }
};

export default notificationService;