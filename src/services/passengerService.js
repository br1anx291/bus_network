// src/services/passengerService.js
import axiosClient from '~/api/axiosClient';
import { rawPassengerData } from '~/features/passengers/data/passengerMockData'; // <-- 1. SỬA IMPORT

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localPassengers = [...rawPassengerData]; // <-- Đổi tên biến (tránh trùng lặp)

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const passengerService = {
  
  /**
   * 1. Lấy danh sách hành khách (Phân trang)
   * [ĐỔI TÊN] getPassengers -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Passengers - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localPassengers.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localPassengers.length,
      });
    }

    // Gọi API thật: GET /passengers?page=1&limit=10
    return axiosClient.get('/passengers', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 hành khách (Bổ sung)
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const passenger = localPassengers.find(p => p.id === id);
      return mockDelay(passenger);
    }
    return axiosClient.get(`/passengers/${id}`);
  },

  /**
   * 3. Thêm hành khách mới
   * [ĐỔI TÊN] createPassenger -> create
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Passenger:', data);

      const newPassenger = {
        ...data,
        id: `p${new Date().getTime()}`,
      };

      localPassengers.unshift(newPassenger);

      return mockDelay(newPassenger);
    }

    // Gọi API thật: POST /passengers
    return axiosClient.post('/passengers', data);
  },

  /**
   * 4. Cập nhật hành khách
   * [ĐỔI TÊN] updatePassenger -> update
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Passenger ${id}:`, data);

      let targetPassenger = null;
      localPassengers = localPassengers.map((p) => {
        if (p.id === id) {
          targetPassenger = { ...p, ...data };
          return targetPassenger;
        }
        return p;
      });

      if (targetPassenger) {
        return mockDelay(targetPassenger);
      } else {
        return Promise.reject(new Error('Không tìm thấy hành khách để cập nhật'));
      }
    }

    // Gọi API thật: PUT /passengers/:id
    return axiosClient.put(`/passengers/${id}`, data);
  },

  /**
   * 5. Xóa hành khách
   * [ĐỔI TÊN] deletePassenger -> delete
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Passenger ${id}`);

      localPassengers = localPassengers.filter(p => p.id !== id);

      return mockDelay({ success: true });
    }

    // Gọi API thật: DELETE /passengers/:id
    return axiosClient.delete(`/passengers/${id}`);
  }
};