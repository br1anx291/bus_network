// src/services/vehicleService.js
import axiosClient from '~/api/axiosClient';
import { rawVehicleData } from '~/features/vehicles/data/vehicleMockData';

// --- CẤU HÌNH ---
// true: Dùng logic giả lập của bạn (Data lưu trong RAM, mất khi F5)
// false: Gọi API thật qua axiosClient
const USE_MOCK = true; 
const MOCK_DELAY = 500;

// --- KHO CHỨA DATA GIẢ LẬP (Của bạn) ---
// Dùng 'let' để thao tác CRUD tạm thời
let localVehicles = [...rawVehicleData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

export const vehicleService = {
  
  /**
   * 1. Lấy danh sách xe (Có hỗ trợ phân trang)
   * @param {number} page - Trang hiện tại
   * @param {number} pageSize - Số lượng item/trang
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Vehicles - Page: ${page}, Size: ${pageSize}`);
      
      // Logic phân trang của bạn
      const start = (page - 1) * pageSize;
      const end = page * pageSize;
      const paginatedData = localVehicles.slice(start, end);

      return mockDelay({
        data: paginatedData,       // Mảng dữ liệu
        total: localVehicles.length, // Tổng số lượng để tính phân trang
      });
    }

    // --- GỌI API THẬT ---
    // Backend thường nhận params: /vehicles?page=1&limit=10
    return axiosClient.get('/vehicles', {
      params: { page, limit: pageSize }
    });
  },

  /**
   * 2. Lấy chi tiết 1 xe
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const vehicle = localVehicles.find((v) => v.id === id);
      return mockDelay(vehicle);
    }

    return axiosClient.get(`/vehicles/${id}`);
  },

  /**
   * 3. Tạo xe mới
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Vehicle:', data);
      
      const newVehicle = {
        ...data,
        id: `v${new Date().getTime()}`, // Tạo ID ngẫu nhiên
      };
      
      // Thêm vào đầu mảng local
      localVehicles.unshift(newVehicle); 

      return mockDelay(newVehicle);
    }

    return axiosClient.post('/vehicles', data);
  },

  /**
   * 4. Cập nhật xe
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Update Vehicle ${id}:`, data);
      
      const index = localVehicles.findIndex(v => v.id === id);
      if (index > -1) {
        localVehicles[index] = { ...localVehicles[index], ...data };
        return mockDelay(localVehicles[index]);
      }
      return Promise.reject(new Error('Vehicle not found'));
    }

    return axiosClient.put(`/vehicles/${id}`, data);
  },

  /**
   * 5. Xóa xe
   */
  delete: async (id) => {
    if (USE_MOCK) {
      console.log(`[MOCK API] Delete Vehicle ${id}`);
      
      // Lọc bỏ xe bị xóa
      localVehicles = localVehicles.filter((v) => v.id !== id);
      
      return mockDelay({ success: true });
    }

    return axiosClient.delete(`/vehicles/${id}`);
  }
};