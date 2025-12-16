// src/services/adminService.js
import pb from '~/api/pocketbase';

// --- CẤU HÌNH ---
const USE_MOCK = false; // Chuyển sang FALSE để chạy thật với PocketBase

// --- HÀM MAPPING (Cầu nối DB Users -> UI AdminTable & Profile) ---
const mapToUI = (record) => {
  // Lấy URL file Avatar nếu có
  // LƯU Ý: 'avatar' phải là tên field File trong collection users
  const avatarUrl = record.avatar 
    ? pb.files.getUrl(record, record.avatar, { thumb: '100x100' }) 
    : null;

  return {
    id: record.id,
    
    // 1. Thông tin cơ bản (Dùng chung)
    name: record.name || record.username || 'Người dùng hệ thống', // Tên hiển thị
    username: record.username,
    email: record.email,
    
    // 2. Thông tin cá nhân (Profile Settings)
    phoneNumber: record.phone_number || '', // DB: phone_number -> UI: phoneNumber
    dob: record.birthdate || null,          // DB: birthdate -> UI: dob (ngày sinh)
    gender: record.gender || null,
    avatarUrl: avatarUrl,                   // URL Avatar
    
    // 3. Thông tin hệ thống (Admin/Role Management)
    role: record.role || 'staff',
    status: record.verified ? 'active' : 'pending',
    created: record.created_at,
  };
};

export const adminService = {
  
  // ===============================================
  // === CHỨC NĂNG QUẢN LÝ ADMIN (User CRUD) ===
  // ===============================================

  /**
   * Lấy danh sách Users (Cho trang quản lý Admin/Users)
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) return { data: [], total: 0 };

    try {
      const result = await pb.collection('users').getList(page, pageSize, {
        sort: '-created_at', // Mới nhất lên đầu
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

  /**
   * Lấy thông tin chi tiết của user bất kỳ (getOne)
   */
  getUserById: async (id) => {
    try {
      const record = await pb.collection('users').getOne(id);
      return mapToUI(record);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Tạo User mới
   */
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

  /**
   * Cập nhật User (Cho trang quản lý Admin/Users)
   */
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

  /**
   * Xóa User
   */
  delete: async (id) => {
    try {
      return await pb.collection('users').delete(id);
    } catch (error) {
      console.error("[AdminService] Lỗi xóa Admin:", error);
      throw error;
    }
  },

  // =========================================================
  // === CHỨC NĂNG MỚI CHO PROFILE SETTINGS (USER ĐANG ĐN) ===
  // =========================================================
  
  /**
   * Lấy hồ sơ của người dùng đang đăng nhập
   */
  getProfile: async () => {
    if (USE_MOCK) return {}; 

    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    
    try {
// $autoCancel: false để tránh bị hủy request khi component unmount
      const record = await pb.collection('users').getOne(userId, { $autoCancel: false, 'v': new Date().getTime() });
      return mapToUI(record);
    } catch (error) {
      console.error("[AdminService] Lỗi lấy Profile:", error);
      throw error;
    }
  },

  /**
   * Cập nhật các trường hồ sơ cá nhân (Tên, DOB, Giới tính, SĐT)
   * @param {object} data - Dữ liệu đã được chuẩn hóa từ UI
   */
  updateProfile: async (data) => {
    if (USE_MOCK) return data; 
    
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");
    
    console.log("--> [Service] Nhận data từ UI:", data);

    // Mapping ngược từ tên UI sang tên DB
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

  /**
   * Upload và cập nhật Avatar
   * @param {File} file - Object File từ Upload Component
   */
  updateAvatar: async (file) => {
    if (USE_MOCK) return {}; 
    
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
    // 1. Kiểm tra đăng nhập
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not logged in");

    // 2. Chuẩn bị Payload đúng chuẩn PocketBase
    // PocketBase yêu cầu chính xác 3 key này:
    const dbPayload = {
      oldPassword: data.oldPassword,
      password: data.newPassword,
      passwordConfirm: data.confirmPassword,
    };

    try {
      // 3. Gọi API update
      const record = await pb.collection('users').update(userId, dbPayload);
      
      // Cập nhật lại AuthStore (để đảm bảo token đồng bộ nếu cần)
      pb.authStore.save(pb.authStore.token, record);
      
      return true;
    } catch (error) {
      console.error("[AdminService] Lỗi đổi mật khẩu:", error);
      throw error;
    }
  },
};