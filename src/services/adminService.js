// src/services/adminService.js
import axiosClient from '~/api/axiosClient';
import { rawAdminData } from '~/features/admins/data/adminMockData'; // <-- 1. SỬA IMPORT

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localAdmins = [...rawAdminData]; // <-- Đổi tên biến

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const adminService = {
  
  /**
   * 1. Lấy danh sách Admin (Phân trang)
   * [ĐỔI TÊN] getAdmins -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Admins - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localAdmins.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localAdmins.length,
      });
    }

    // Gọi API thật: GET /admins?page=1&limit=10
    return axiosClient.get('/admins', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 Admin
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const admin = localAdmins.find(a => a.id === id);
      return mockDelay(admin);
    }
    return axiosClient.get(`/admins/${id}`);
  },

  /**
   * 3. Thêm Admin mới
   * [ĐỔI TÊN] createAdmin -> create
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Admin:', data);

      const newAdmin = {
        ...data,
        id: `a${new Date().getTime()}`,
      };

      localAdmins.unshift(newAdmin);

      return mockDelay(newAdmin);
    }

    // Gọi API thật: POST /admins
    return axiosClient.post('/admins', data);
  },

  /**
   * 4. Cập nhật Admin
   * [ĐỔI TÊN] updateAdmin -> update
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Admin ${id}:`, data);

      let targetAdmin = null;
      localAdmins = localAdmins.map((a) => {
        if (a.id === id) {
          targetAdmin = { ...a, ...data };
          return targetAdmin;
        }
        return a;
      });

      if (targetAdmin) {
        return mockDelay(targetAdmin);
      } else {
        return Promise.reject(new Error('Không tìm thấy Admin để cập nhật'));
      }
    }

    // Gọi API thật: PUT /admins/:id
    return axiosClient.put(`/admins/${id}`, data);
  },

  /**
   * 5. Xóa Admin
   * [ĐỔI TÊN] deleteAdmin -> delete
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Admin ${id}`);

      localAdmins = localAdmins.filter(a => a.id !== id);

      return mockDelay({ success: true });
    }

    // Gọi API thật: DELETE /admins/:id
    return axiosClient.delete(`/admins/${id}`);
  }
};