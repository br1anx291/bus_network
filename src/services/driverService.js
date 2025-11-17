// src/services/driverService.js
import axiosClient from '~/api/axiosClient';
import { rawDriverData } from '~/features/drivers/data/driverMockData'; // <-- 1. SỬA IMPORT

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localDrivers = [...rawDriverData]; // <-- Đổi tên biến (tránh trùng lặp)

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const driverService = {
  
  /**
   * 1. Lấy danh sách tài xế (Phân trang)
   * [ĐỔI TÊN] getDrivers -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Drivers - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localDrivers.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localDrivers.length,
      });
    }

    // Gọi API thật: GET /drivers?page=1&limit=10
    return axiosClient.get('/drivers', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 tài xế (Bổ sung)
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const driver = localDrivers.find(d => d.id === id);
      return mockDelay(driver);
    }
    return axiosClient.get(`/drivers/${id}`);
  },

  /**
   * 3. Thêm tài xế mới
   * [ĐỔI TÊN] createDriver -> create
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Driver:', data);

      const newDriver = {
        ...data,
        id: `d${new Date().getTime()}`,
      };

      localDrivers.unshift(newDriver);

      return mockDelay(newDriver);
    }

    // Gọi API thật: POST /drivers
    return axiosClient.post('/drivers', data);
  },

  /**
   * 4. Cập nhật tài xế
   * [ĐỔI TÊN] updateDriver -> update
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Driver ${id}:`, data);

      let targetDriver = null;
      localDrivers = localDrivers.map((d) => {
        if (d.id === id) {
          targetDriver = { ...d, ...data };
          return targetDriver;
        }
        return d;
      });

      if (targetDriver) {
        return mockDelay(targetDriver);
      } else {
        return Promise.reject(new Error('Không tìm thấy tài xế để cập nhật'));
      }
    }

    // Gọi API thật: PUT /drivers/:id
    return axiosClient.put(`/drivers/${id}`, data);
  },

  /**
   * 5. Xóa tài xế
   * [ĐỔI TÊN] deleteDriver -> delete
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Driver ${id}`);

      localDrivers = localDrivers.filter(d => d.id !== id);

      return mockDelay({ success: true });
    }

    // Gọi API thật: DELETE /drivers/:id
    return axiosClient.delete(`/drivers/${id}`);
  }
};