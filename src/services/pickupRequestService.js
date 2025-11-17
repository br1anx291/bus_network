// src/services/pickupRequestService.js
import axiosClient from '~/api/axiosClient';
import { rawPickupRequestData } from '~/features/pickupRequests/data/pickupRequestMockData';

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = true; // true = Dùng Mock, false = Dùng API thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP ---
let localRequests = [...rawPickupRequestData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const pickupRequestService = {
  
  /**
   * 1. Lấy danh sách yêu cầu (Phân trang)
   * [ĐỔI TÊN] getPickupRequests -> getAll
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Pickup Requests - Page: ${page}, Size: ${pageSize}`);
      
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localRequests.slice(start, end);

      return mockDelay({
        data: paginatedData,
        total: localRequests.length,
      });
    }

    // Gọi API thật: GET /pickup-requests?page=1&limit=10
    return axiosClient.get('/pickup-requests', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Cập nhật trạng thái yêu cầu
   * [ĐỔI TÊN] updatePickupRequestStatus -> updateStatus
   */
  updateStatus: async (id, newStatus) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Request Status ${id}:`, newStatus);

      let targetRequest = null;
      localRequests = localRequests.map((req) => {
        if (req.id === id) {
          targetRequest = { ...req, status: newStatus };
          return targetRequest;
        }
        return req;
      });

      if (targetRequest) {
        return mockDelay({ success: true, request: targetRequest });
      } else {
        return Promise.reject(new Error('Không tìm thấy yêu cầu để cập nhật'));
      }
    }

    // Gọi API thật: PATCH /pickup-requests/:id/status
    // (Backend thường dùng PATCH cho việc cập nhật 1 trường nhỏ như status)
    return axiosClient.patch(`/pickup-requests/${id}/status`, { status: newStatus });
  }
};