import pb from '~/api/pocketbase'; 
import { rawVehicleData } from '~/features/vehicles/data/vehicleMockData';

// === CẤU HÌNH ===
const USE_MOCK = false; 
const MOCK_DELAY = 500;
let localVehicles = [...rawVehicleData];

// Hàm Helper giả lập độ trễ
const mockDelay = (data) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
};

// --- 🔧 HÀM MAPPING (BỘ CHUYỂN ĐỔI QUAN TRỌNG) ---
const mapToUI = (record) => {
  const expand = record.expand || {};
  
  // Xử lý an toàn cho expand (mảng hoặc object)
  const toArray = (data) => (Array.isArray(data) ? data : (data ? [data] : []));
  
  const routeInfo = toArray(expand.current_route)[0]; // Field DB là 'current_route'
  const driverInfo = toArray(expand.driver)[0];       // Field DB là 'driver'

  return {
    id: record.id,
    
    // 1. Thông tin cơ bản
    plate: record.license_plate, 
    model: record.name || 'Chưa cập nhật',
    capacity: record.capacity,
    status: record.status,
    updated: record.updated,

    // 2. Xử lý TUYẾN (Quan trọng cho quy trình Sửa)
    // - routes: GIỮ ID GỐC -> Để Form Modal binding vào Select box
    routes: record.current_route, 
    // - routeName: LẤY TÊN -> Để Table hiển thị
    routeName: routeInfo ? routeInfo.name : 'Chưa phân tuyến',
    
    // 3. Xử lý TÀI XẾ (Quan trọng cho quy trình Sửa)
    // - driver: GIỮ ID GỐC -> Để Form Modal binding vào Select box
    driver: record.driver,
    // - driverName: LẤY TÊN -> Để Table hiển thị
    driverName: driverInfo ? (driverInfo.name || driverInfo.email) : 'Chưa phân công',
  };
};

export const vehicleService = {
  
  /**
   * 1. Lấy danh sách xe
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    // --- MOCK ---
    if (USE_MOCK) {
      const start = (page - 1) * pageSize;
      const paginatedData = localVehicles.slice(start, start + pageSize);
      return mockDelay({ data: paginatedData, total: localVehicles.length });
    }

    // --- POCKETBASE ---
    try {
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `license_plate ~ "${filters.search}"`;
      }

      // Lưu ý: Collection tên là 'buses' (theo code cũ của bạn)
      const result = await pb.collection('buses').getList(page, pageSize, {
        sort: '-created',
        // [QUAN TRỌNG] Expand đúng tên field trong DB
        expand: 'driver,current_route', 
        filter: filterExpr
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách xe:", error);
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Tạo xe mới
   */
  create: async (data) => {
    if (USE_MOCK) {
      const newVehicle = { ...data, id: `v${Date.now()}` };
      localVehicles.unshift(newVehicle); 
      return mockDelay(newVehicle);
    }

    try {
      // Mapping NGƯỢC: UI (routes, driver) -> DB (current_route, driver)
      const dbPayload = {
        license_plate: data.plate,
        name: data.model,
        capacity: data.capacity,
        status: data.status || 'N/A',
        
        // [QUAN TRỌNG] Map từ Form (routes) sang DB (current_route)
        current_route: data.routes || null, 
        
        // [QUAN TRỌNG] Map từ Form (driver) sang DB (driver)
        driver: data.driver || null,
      };

      const record = await pb.collection('buses').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo xe:", error);
      throw error;
    }
  },

  /**
   * 3. Cập nhật xe
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      const index = localVehicles.findIndex(v => v.id === id);
      if (index > -1) {
        localVehicles[index] = { ...localVehicles[index], ...data };
        return mockDelay(localVehicles[index]);
      }
      return Promise.reject(new Error('Vehicle not found'));
    }

    try {
      // Mapping NGƯỢC: UI -> DB
      const dbPayload = {
        ...(data.plate && { license_plate: data.plate }),
        ...(data.model && { name: data.model }),
        ...(data.capacity && { capacity: data.capacity }),
        ...(data.status && { status: data.status }),
        
        // [FIX] Kiểm tra nếu có thay đổi driver thì map vào payload
        ...(data.driver !== undefined && { driver: data.driver }),
        
        // [FIX] Kiểm tra nếu có thay đổi routes thì map vào current_route
        ...(data.routes !== undefined && { current_route: data.routes }),
      };

      const record = await pb.collection('buses').update(id, dbPayload);
      
      // Get lại record với expand để UI cập nhật ngay tên Tài xế/Tuyến mới
      const expandedRecord = await pb.collection('buses').getOne(record.id, {
         expand: 'driver,current_route'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật xe ${id}:`, error);
      throw error;
    }
  },

  /**
   * 4. Xóa xe
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localVehicles = localVehicles.filter((v) => v.id !== id);
      return mockDelay({ success: true });
    }

    try {
      return await pb.collection('buses').delete(id);
    } catch (error) {
      console.error("[PocketBase] Lỗi xóa xe:", error);
      throw error;
    }
  }
};