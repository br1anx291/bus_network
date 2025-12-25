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

  getNotifications: async (page = 1, perPage = 10) => {
    const userId = pb.authStore.model?.id;
    return await pb.collection('notifications').getList(page, perPage, {
      filter: `users = "${userId}"`, 
      sort: '-time',          
    });
  },
  

  markAsRead: async (notificationId) => {
    return await pb.collection('notifications').update(notificationId, {
      is_read: true 
    });
  },

  subscribeToNotifications: (callback) => {
    return pb.collection('notifications').subscribe('*', (e) => {
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