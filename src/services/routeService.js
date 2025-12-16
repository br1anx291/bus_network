// src/services/routeService.js

// --- [NÂNG CẤP 1] IMPORT POCKETBASE ---
import pb from '~/api/pocketbase';
import { rawRouteData } from '~/features/routes/data/routeMockData';

// --- [NÂNG CẤP 2] CẤU HÌNH CHẾ ĐỘ MOCK ---
// true: Dùng logic giả lập (RAM)
// false: Dùng API thật PocketBase
const USE_MOCK = false; 
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP (BACKUP) ---
let localRoutes = [...rawRouteData]; 

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- [MỚI] HÀM MAPPING (CẦU NỐI DB <-> UI) ---
// Giúp Web hiển thị đúng dù DB có tên cột khác
const mapToUI = (record) => {
  return {
    id: record.id,
    
    // 1. Thông tin cơ bản
    name: record.name,
    description: record.description,
    
    // 2. Thông tin mới (Code, Status)
    // Nếu DB chưa có dữ liệu thì trả về chuỗi rỗng hoặc mặc định
    code: record.code || 'N/A', 
    status: record.status || 'NULL',

    // 3. Dữ liệu Bản đồ (Quan trọng sau này)
    // Cột 'path_json' trong DB -> biến 'path' trong UI
    path: record.path_json || [], 

    // 4. Số trạm dừng (Logic tạm thời)
    // Vì chưa query bảng route_stations, ta trả về 0 để UI không lỗi
    totalStops: 0, 

    updatedAt: record.updated,
  };
};

export const routeService = {
  
  /**
   * 1. Lấy danh sách tuyến
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    // --- NHÁNH 1: MOCK ---
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Routes - Page: ${page}`);
      const start = (page - 1) * pageSize;
      const paginatedData = localRoutes.slice(start, start + pageSize);
      return mockDelay({
        data: paginatedData,
        total: localRoutes.length,
      });
    }

    // --- NHÁNH 2: POCKETBASE ---
    try {
      // Xây dựng bộ lọc tìm kiếm (Theo Tên hoặc Mã)
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || code ~ "${filters.search}"`;
      }

      const result = await pb.collection('routes').getList(page, pageSize, {
        sort: '-created', // Mới nhất lên đầu
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách tuyến:", error);
      // Trả về rỗng để Web không bị trắng trang
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Lấy chi tiết 1 tuyến
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const route = localRoutes.find((r) => r.id === id);
      return mockDelay(route);
    }

    // --- POCKETBASE ---
    try {
      const record = await pb.collection('routes').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy tuyến ${id}:`, error);
      throw error;
    }
  },
  getStationsByRoute: async (routeId) => {
      try {
        // Tìm các dòng trong bảng trung gian có routes = routeId hiện tại
        const records = await pb.collection('route_stations').getFullList({
          filter: `routes = "${routeId}"`, // Lọc theo cột 'routes'
          fields: 'stations', // Chỉ lấy cột 'stations' (ID trạm) về cho nhẹ
        });

        // records sẽ trả về dạng: [{ stations: "id_tram_A" }, { stations: "id_tram_B" }]
        // Ta cần map nó thành mảng đơn giản: ["id_tram_A", "id_tram_B"]
        return records.map(rec => rec.stations);
      } catch (error) {
        console.error("[RouteService] Lỗi lấy trạm theo tuyến:", error);
        return [];
      }
  },

  /**
   * 3. Tạo tuyến mới
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Route:', data);
      const newRoute = { ...data, id: `r${Date.now()}` };
      localRoutes.unshift(newRoute);
      return mockDelay(newRoute);
    }

    // --- POCKETBASE ---
    try {
      // Map từ UI -> DB
      const dbPayload = {
        name: data.name,
        description: data.description,
        
        // Các trường mới (Nếu Form chưa gửi lên thì thôi)
        code: data.code,  
        status: data.status,
        
        // Mặc định path_json là mảng rỗng (sau này vẽ map sẽ update sau)
        path_json: [], 
      };

      const record = await pb.collection('routes').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo tuyến:", error);
      throw error;
    }
  },

  /**
   * 4. Cập nhật tuyến
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      const index = localRoutes.findIndex(r => r.id === id);
      if (index > -1) {
        localRoutes[index] = { ...localRoutes[index], ...data };
        return mockDelay(localRoutes[index]);
      }
      return Promise.reject(new Error('Route not found'));
    }

    // --- POCKETBASE ---
    try {
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.code && { code: data.code }),
        ...(data.status && { status: data.status }),
        // Không update path_json ở đây để tránh ghi đè nhầm
        ...(data.path_json && { path_json: data.path_json }),
      };

      const record = await pb.collection('routes').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật tuyến ${id}:`, error);
      throw error;
    }
  },

  /**
   * 5. Xóa tuyến
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localRoutes = localRoutes.filter((r) => r.id !== id);
      return mockDelay({ success: true });
    }

    // --- POCKETBASE ---
    return await pb.collection('routes').delete(id);
  },
  /**
   * [MỚI] 7. Cập nhật danh sách trạm cho tuyến
   * Logic: Xóa hết liên kết cũ -> Tạo liên kết mới
   */
  updateRouteStations: async (routeId, stationIds) => {
    try {
      // B1: Lấy danh sách các liên kết cũ của tuyến này
      const oldLinks = await pb.collection('route_stations').getFullList({
        filter: `routes = "${routeId}"`,
      });

      // B2: Xóa sạch các liên kết cũ (Chạy song song cho nhanh)
      // *Lưu ý: Cách này hơi "thô" nhưng an toàn nhất để tránh trùng lặp hoặc sót data
      await Promise.all(oldLinks.map(link => pb.collection('route_stations').delete(link.id)));

      // B3: Tạo các liên kết mới theo danh sách stationIds gửi lên
      // Duyệt qua mảng stationIds và tạo từng dòng trong bảng route_stations
      const createPromises = stationIds.map((stationId, index) => {
        return pb.collection('route_stations').create({
          routes: routeId,
          stations: stationId,
          stop_order: index + 1, // Lưu thứ tự trạm (1, 2, 3...)
        });
      });

      await Promise.all(createPromises);
      
      return true;
    } catch (error) {
      console.error("Lỗi cập nhật trạm cho tuyến:", error);
      throw error;
    }
  }
};