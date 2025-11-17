// src/services/tripService.js
import axiosClient from '~/api/axiosClient';
import { rawTripData } from '~/features/trips/data/tripMockData';

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localTrips = [...rawTripData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const tripService = {
  
  /**
   * 1. Lấy danh sách chuyến (Phân trang)
   * [ĐỔI TÊN] getTrips -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Trips - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localTrips.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localTrips.length,
      });
    }

    // Gọi API thật: GET /trips?page=1&limit=10
    return axiosClient.get('/trips', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 chuyến
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const trip = localTrips.find(t => t.id === id);
      return mockDelay(trip);
    }
    return axiosClient.get(`/trips/${id}`);
  },

  /**
   * 3. Thêm chuyến mới
   * [ĐỔI TÊN] createTrip -> create
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Trip:', data);

      const newTrip = {
        ...data,
        id: `t${new Date().getTime()}`, // Tạo ID giả
      };

      localTrips.unshift(newTrip);

      return mockDelay(newTrip);
    }

    // Gọi API thật: POST /trips
    return axiosClient.post('/trips', data);
  },

  /**
   * 4. Cập nhật chuyến
   * [ĐỔI TÊN] updateTrip -> update
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Trip ${id}:`, data);

      const index = localTrips.findIndex(t => t.id === id);
      if (index > -1) {
        localTrips[index] = { ...localTrips[index], ...data };
        return mockDelay(localTrips[index]);
      }
      return Promise.reject(new Error('Trip not found'));
    }

    // Gọi API thật: PUT /trips/:id
    return axiosClient.put(`/trips/${id}`, data);
  },

  /**
   * 5. Xóa chuyến
   * [ĐỔI TÊN] deleteTrip -> delete
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Trip ${id}`);

      localTrips = localTrips.filter(t => t.id !== id);

      return mockDelay({ success: true });
    }

    // Gọi API thật: DELETE /trips/:id
    return axiosClient.delete(`/trips/${id}`);
  }
};