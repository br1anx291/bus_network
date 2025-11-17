// src/services/stationService.js
import axiosClient from '~/api/axiosClient';
import { rawStationData } from '~/features/stations/data/stationMockData';

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localStations = [...rawStationData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const stationService = {
  
  /**
   * 1. Lấy danh sách trạm (Phân trang)
   * [ĐỔI TÊN] getStations -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Stations - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localStations.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localStations.length,
      });
    }

    // Gọi API thật: GET /stations?page=1&limit=10
    return axiosClient.get('/stations', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 trạm (Bổ sung thêm cho đầy đủ)
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const station = localStations.find(s => s.id === id);
      return mockDelay(station);
    }
    return axiosClient.get(`/stations/${id}`);
  },

  /**
   * 3. Thêm trạm mới
   * [ĐỔI TÊN] createStation -> create
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Station:', data);

      const newStation = {
        ...data,
        id: `s${new Date().getTime()}`, // Tạo ID giả
      };

      localStations.unshift(newStation);

      return mockDelay(newStation);
    }

    // Gọi API thật: POST /stations
    return axiosClient.post('/stations', data);
  },

  /**
   * 4. Cập nhật trạm
   * [ĐỔI TÊN] updateStation -> update
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Station ${id}:`, data);

      const index = localStations.findIndex(s => s.id === id);
      if (index > -1) {
        localStations[index] = { ...localStations[index], ...data };
        return mockDelay(localStations[index]);
      }
      return Promise.reject(new Error('Station not found'));
    }

    // Gọi API thật: PUT /stations/:id
    return axiosClient.put(`/stations/${id}`, data);
  },

  /**
   * 5. Xóa trạm
   * [ĐỔI TÊN] deleteStation -> delete
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Station ${id}`);

      localStations = localStations.filter(s => s.id !== id);

      return mockDelay({ success: true });
    }

    // Gọi API thật: DELETE /stations/:id
    return axiosClient.delete(`/stations/${id}`);
  }
};