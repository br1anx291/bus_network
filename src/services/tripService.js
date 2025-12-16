// src/services/tripService.js
import pb from '~/api/pocketbase';

// --- CẤU HÌNH ---
// true: Dùng Mock (RAM) | false: Dùng API thật (PocketBase)
const USE_MOCK = false; 
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP (BACKUP) ---
// (Bạn có thể import mock data ở đây nếu cần test UI mà không có mạng)
let localTrips = []; 

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// src/services/tripService.js

const mapToUI = (record) => {
  // 1. Lấy expand an toàn (nếu không có thì là object rỗng)
  const expand = record.expand || {};

  // 2. Hàm tiện ích: Luôn ép kiểu về Mảng (Array) để xử lý đồng nhất
  // Nếu là mảng -> giữ nguyên. Nếu là object -> gói vào mảng. Nếu null/undefined -> mảng rỗng.
  const toArray = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  };

  const buses = toArray(expand.buses);
  const routes = toArray(expand.routes);

  return {
    id: record.id,

    // --- XỬ LÝ XE (BUS) ---
    busId: record.buses, 
    // Nếu có nhiều xe: Nối biển số lại bằng dấu phẩy
    busName: buses.length > 0 
      ? buses.map(b => `${b.license_plate}`).join(', ') 
      : 'Chưa gán xe',

    // --- XỬ LÝ TUYẾN (ROUTE) ---
    routeId: record.routes,
    // Nếu có nhiều tuyến: Nối tên lại (VD: "Tuyến A, Tuyến B")
    routeName: routes.length > 0 
      ? routes.map(r => r.name).join(', ') 
      : 'Chưa gán tuyến',

    // Các trường khác giữ nguyên
    startTime: record.start_time,
    endTime: record.end_time,
    status: record.status || 'scheduled',
    created: record.created,
    updated: record.updated,
  };
};

export const tripService = {
  
  /**
   * 1. Lấy danh sách chuyến (Có Expand & Phân trang)
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    // --- NHÁNH MOCK ---
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Trips - Page: ${page}`);
      const start = (page - 1) * pageSize;
      const paginatedData = localTrips.slice(start, start + pageSize);
      return mockDelay({
        data: paginatedData,
        total: localTrips.length,
      });
    }

    // --- NHÁNH POCKETBASE ---
    try {
      // Xây dựng bộ lọc
      let filterExpr = '';
      if (filters.status) {
        filterExpr = `status = "${filters.status}"`;
      }
      // Bạn có thể thêm lọc theo routeId hoặc busId tại đây nếu cần

      const result = await pb.collection('trips').getList(page, pageSize, {
        sort: '-start_time',       // Sắp xếp: Chuyến mới nhất lên đầu
        filter: filterExpr,
        expand: 'buses,routes',    // [QUAN TRỌNG]: Lấy thông tin chi tiết bảng liên kết
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách chuyến:", error);
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Lấy chi tiết 1 chuyến
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const trip = localTrips.find(t => t.id === id);
      return mockDelay(trip);
    }

    try {
      const record = await pb.collection('trips').getOne(id, {
        expand: 'buses,routes', // Cũng cần expand khi lấy chi tiết
      });
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy chuyến ${id}:`, error);
      throw error;
    }
  },

  /**
   * 3. Thêm chuyến mới
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Trip:', data);
      const newTrip = { ...data, id: `t${Date.now()}` };
      localTrips.unshift(newTrip);
      return mockDelay(newTrip);
    }

    try {
      // Data nhận vào từ Form: { buses: 'ID_XE', routes: 'ID_TUYEN', start_time: '...', ... }
      const record = await pb.collection('trips').create(data);
      
      // Sau khi tạo xong, ta cần get lại nó kèm expand để hiển thị đúng tên xe/tuyến trên UI ngay lập tức
      // (Hoặc có thể chỉ return record thô và reload lại bảng)
      const expandedRecord = await pb.collection('trips').getOne(record.id, {
        expand: 'buses,routes'
      });
      
      return mapToUI(expandedRecord);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo chuyến:", error);
      throw error;
    }
  },

  /**
   * 4. Cập nhật chuyến
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      const index = localTrips.findIndex(t => t.id === id);
      if (index > -1) {
        localTrips[index] = { ...localTrips[index], ...data };
        return mockDelay(localTrips[index]);
      }
      return Promise.reject(new Error('Trip not found'));
    }

    try {
      const record = await pb.collection('trips').update(id, data);
      
      // Tương tự create, get lại bản ghi kèm expand
      const expandedRecord = await pb.collection('trips').getOne(record.id, {
        expand: 'buses,routes'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật chuyến ${id}:`, error);
      throw error;
    }
  },

  /**
   * 5. Xóa chuyến
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localTrips = localTrips.filter(t => t.id !== id);
      return mockDelay({ success: true });
    }

    return await pb.collection('trips').delete(id);
  }
};