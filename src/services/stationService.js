// src/services/stationService.js
import pb from '~/api/pocketbase'; // [MỚI] Import PocketBase
import { rawStationData } from '~/features/stations/data/stationMockData';

// --- CẤU HÌNH CHẾ ĐỘ ---
const USE_MOCK = false; // [MỚI] Đổi sang FALSE để chạy thật
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP (BACKUP) ---
let localStations = [...rawStationData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- [QUAN TRỌNG] HÀM MAPPING (CẦU NỐI DB <-> UI) ---
const mapToUI = (record) => {
  return {
    id: record.id,
    name: record.name,
    address: record.address || '',
    
    // [MAPPING TOẠ ĐỘ]
    // DB (latitude/longitude) -> UI (lat/lng)
    lat: record.latitude || 0,
    lng: record.longitude || 0,
    
    status: record.status || 'Active',
    updatedAt: record.updated,
  };
};

export const stationService = {
  
  /**
   * 1. Lấy danh sách trạm (Phân trang & Tìm kiếm)
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    // --- NHÁNH MOCK ---
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Stations - Page: ${page}`);
      const start = (page - 1) * pageSize;
      const paginatedData = localStations.slice(start, start + pageSize);
      return mockDelay({
        data: paginatedData,
        total: localStations.length,
      });
    }

    // --- NHÁNH POCKETBASE ---
    try {
      // Logic tìm kiếm: Tìm theo Tên HOẶC Địa chỉ
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || address ~ "${filters.search}"`;
      }

      const result = await pb.collection('stations').getList(page, pageSize, {
        // sort: '-created', // Mới nhất lên đầu
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách trạm:", error);
      // Trả về rỗng thay vì lỗi để web không chết
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Lấy chi tiết 1 trạm
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const station = localStations.find(s => s.id === id);
      return mockDelay(station);
    }

    // --- POCKETBASE ---
    try {
      const record = await pb.collection('stations').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy trạm ${id}:`, error);
      throw error;
    }
  },

  /**
   * 3. Thêm trạm mới
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Station:', data);
      const newStation = { ...data, id: `s${Date.now()}` };
      localStations.unshift(newStation);
      return mockDelay(newStation);
    }

    // --- POCKETBASE ---
    try {
      // Mapping NGƯỢC: UI (lat/lng) -> DB (latitude/longitude)
      const dbPayload = {
        name: data.name,
        address: data.address,
        latitude: data.lat,  // <--- Chú ý dòng này
        longitude: data.lng, // <--- Chú ý dòng này
        status: data.status || 'Active',
      };

      const record = await pb.collection('stations').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo trạm:", error);
      throw error;
    }
  },

  /**
   * 4. Cập nhật trạm
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      const index = localStations.findIndex(s => s.id === id);
      if (index > -1) {
        localStations[index] = { ...localStations[index], ...data };
        return mockDelay(localStations[index]);
      }
      return Promise.reject(new Error('Station not found'));
    }

    // --- POCKETBASE ---
    try {
      // Chỉ gửi những trường có thay đổi
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.lat && { latitude: data.lat }),   // Map ngược
        ...(data.lng && { longitude: data.lng }), // Map ngược
        ...(data.status && { status: data.status }),
      };

      const record = await pb.collection('stations').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật trạm ${id}:`, error);
      throw error;
    }
  },

  /**
   * 5. Xóa trạm
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localStations = localStations.filter(s => s.id !== id);
      return mockDelay({ success: true });
    }

    // --- POCKETBASE ---
    return await pb.collection('stations').delete(id);
  }
};