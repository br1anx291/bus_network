// src/services/incidentService.js
import axiosClient from '~/api/axiosClient';
import { rawIncidentData } from '~/features/incidents/data/incidentMockData';

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localIncidents = [...rawIncidentData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const incidentService = {
  
  /**
   * 1. Lấy danh sách sự cố (Phân trang)
   * [ĐỔI TÊN] getIncidents -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Incidents - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localIncidents.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localIncidents.length,
      });
    }

    // Gọi API thật: GET /incidents?page=1&limit=10
    return axiosClient.get('/incidents', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Cập nhật trạng thái hoàn thành
   * [ĐỔI TÊN] updateIncidentCompletion -> updateCompletion
   */
  updateCompletion: async (id, isCompleted) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Completion ${id}:`, isCompleted);

      let targetIncident = null;
      localIncidents = localIncidents.map((item) => {
        if (item.id === id) {
          // LOGIC NGHIỆP VỤ CỦA BẠN:
          targetIncident = { 
            ...item, 
            isCompleted: isCompleted,
            status: isCompleted ? 'Đã xử lý' : 'Mới' 
          };
          return targetIncident;
        }
        return item;
      });

      if (targetIncident) {
        return mockDelay({ success: true, incident: targetIncident });
      } else {
        return Promise.reject(new Error('Không tìm thấy sự cố để cập nhật'));
      }
    }

    // Gọi API thật: PATCH /incidents/:id/completion
    return axiosClient.patch(`/incidents/${id}/completion`, { isCompleted });
  },

  /**
   * 3. Xóa sự cố (Thêm vào cho đủ bộ CRUD)
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localIncidents = localIncidents.filter(i => i.id !== id);
      return mockDelay({ success: true });
    }
    return axiosClient.delete(`/incidents/${id}`);
  }
};