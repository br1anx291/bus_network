// src/services/routeService.js

// --- [NÂNG CẤP 1] IMPORT AXIOS CLIENT ---
import axiosClient from '~/api/axiosClient'; 
import { rawRouteData } from '~/features/routes/data/routeMockData';

// --- [NÂNG CẤP 2] CẤU HÌNH CHẾ ĐỘ MOCK ---
// true: Dùng logic giả lập cũ của bạn
// false: Gọi API thật (Sau này chỉ cần sửa số này thành false là xong)
const USE_MOCK = true; 
const MOCK_DELAY = 500;

// --- KHO CHỨA DATA GIẢ LẬP (Giữ nguyên logic cũ của bạn) ---
let localRoutes = [...rawRouteData]; 

// Hàm Helper giả lập độ trễ (Giữ nguyên)
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const routeService = {
  
  /**
   * 1. Lấy danh sách tuyến
   * [NÂNG CẤP 3] Đổi tên từ 'getRoutes' -> 'getAll' cho chuẩn
   */
  getAll: async (page = 1, pageSize = 10) => {
    // --- NHÁNH 1: CHẠY MOCK (Logic cũ của bạn) ---
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Routes - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localRoutes.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localRoutes.length,
      });
    }

    // --- [NÂNG CẤP 4] NHÁNH 2: GỌI API THẬT ---
    // Backend thường nhận: /routes?page=1&limit=10
    return axiosClient.get('/routes', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 tuyến (Thêm mới cho đầy đủ)
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const route = localRoutes.find((r) => r.id === id);
      return mockDelay(route);
    }
    return axiosClient.get(`/routes/${id}`);
  },

  /**
   * 3. Tạo tuyến mới
   * [NÂNG CẤP 5] Đổi tên từ 'createRoute' -> 'create'
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Route:', data);
      
      const newRoute = {
        ...data,
        id: `r${new Date().getTime()}`,
      };
      
      localRoutes.unshift(newRoute); // Thêm vào đầu mảng

      return mockDelay(newRoute); // Trả về object vừa tạo (mock)
      // Hoặc trả về cấu trúc chuẩn: { success: true, data: newRoute }
    }

    // Gọi API thật
    return axiosClient.post('/routes', data);
  },

  /**
   * 4. Cập nhật tuyến
   * [NÂNG CẤP 6] Đổi tên từ 'updateRoute' -> 'update'
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Route ${id}:`, data);
      
      const index = localRoutes.findIndex(r => r.id === id);
      if (index > -1) {
        // Merge data cũ và mới
        localRoutes[index] = { ...localRoutes[index], ...data };
        return mockDelay(localRoutes[index]);
      }
      return Promise.reject(new Error('Route not found'));
    }

    // Gọi API thật
    return axiosClient.put(`/routes/${id}`, data);
  },

  /**
   * 5. Xóa tuyến
   * [NÂNG CẤP 7] Đổi tên từ 'deleteRoute' -> 'delete'
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Route ${id}`);
      
      localRoutes = localRoutes.filter((r) => r.id !== id);
      
      return mockDelay({ success: true });
    }

    // Gọi API thật
    return axiosClient.delete(`/routes/${id}`);
  }
};