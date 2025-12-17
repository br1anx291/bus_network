import pb from '~/api/pocketbase';

const USE_MOCK = false; 

const mapToUI = (record) => {
  const avatarUrl = record.avatar 
    ? pb.files.getUrl(record, record.avatar, { thumb: '100x100' }) 
    : null;

  return {
    id: record.id,
    name: record.name || record.username || 'Người dùng hệ thống', 
    username: record.username,
    email: record.email,
    
    phoneNumber: record.phone_number || '', 
    dob: record.birthdate || null,          
    gender: record.gender || null,
    avatarUrl: avatarUrl,             
    
    role: record.role || 'staff',
    status: record.verified ? 'active' : 'pending',
    created: record.created_at,
  };
};

export const adminService = {

  getAll: async (page = 1, pageSize = 10) => {
    try {
      const result = await pb.collection('users').getList(page, pageSize, {
        sort: '-created_at',
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[AdminService] Lỗi lấy danh sách:", error);
      return { data: [], total: 0 };
    }
  },


  getUserById: async (id) => {
    try {
      const record = await pb.collection('users').getOne(id);
      return mapToUI(record);
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const dbPayload = {
        username: data.username, 
        email: data.email,
        emailVisibility: true,
        phone_number: data.phoneNumber,
        role: data.role,
        password: data.password,
        passwordConfirm: data.passwordConfirm || data.password, 
        verified: false, 
      };

      const record = await pb.collection('users').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[AdminService] Lỗi tạo Admin:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const dbPayload = {
        username: data.username,
        phone_number: data.phoneNumber,
        role: data.role,
      };

      const record = await pb.collection('users').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[AdminService] Lỗi cập nhật Admin ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await pb.collection('users').delete(id);
    } catch (error) {
      console.error("[AdminService] Lỗi xóa Admin:", error);
      throw error;
    }
  },

  getProfile: async () => {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    
    try {
      const record = await pb.collection('users').getOne(userId, { $autoCancel: false, 'v': new Date().getTime() });
      return mapToUI(record);
    } catch (error) {
      console.error("[AdminService] Lỗi lấy Profile:", error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    console.log("--> [Service] Nhận data từ UI:", data);

    const dbPayload = {
      gender: data.gender,
      phone_number: data.phoneNumber,
      birthdate: data.dob,
    };

    console.log("--> [Service] Payload gửi DB:", dbPayload);
    
    try {
      const record = await pb.collection('users').update(userId, dbPayload);
      pb.authStore.save(pb.authStore.token, record);
      console.log("--> [Service] Update thành công, AuthStore updated.");
      return mapToUI(record);
    } catch (error) {
      console.error("[AdminService] Lỗi cập nhật Profile:", error);
      throw error;
    }
  },

  updateAvatar: async (file) => {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    const formData = new FormData();
    formData.append('avatar', file); 
    
    try {
      const record = await pb.collection('users').update(userId, formData);
      pb.authStore.save(pb.authStore.token, record);
      return mapToUI(record);
    } catch (error) {
      console.error("[AdminService] Lỗi upload Avatar:", error);
      throw error;
    }
  },
  changePassword: async (data) => {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    const dbPayload = {
      oldPassword: data.oldPassword,
      password: data.newPassword,
      passwordConfirm: data.confirmPassword,
    };

    try {
      const record = await pb.collection('users').update(userId, dbPayload);
      pb.authStore.save(pb.authStore.token, record);
      return true;
    } catch (error) {
      console.error("[AdminService] Lỗi đổi mật khẩu:", error);
      throw error;
    }
  },
};