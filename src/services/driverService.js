// src/services/driverService.js
import pb from '~/api/pocketbase'; // [MỚI] Import PocketBase
import { rawDriverData } from '~/features/drivers/data/driverMockData';

// --- CẤU HÌNH CHẾ ĐỘ ---
// true: Dùng Mock (RAM) | false: Dùng API thật (PocketBase)
const USE_MOCK = false; 
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP (BACKUP) ---
let localDrivers = [...rawDriverData];

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
    email: record.email || '',
    phone: record.phone || '',
    
    // Mapping: DB (snake_case) -> UI (camelCase)
    licenseNumber: record.license_number || '', 
    
    // Status: active, off_duty, leave...
    status: record.status || 'active',
    
    // avatar: record.avatar ? pb.files.getUrl(record, record.avatar) : null, // Lấy URL ảnh nếu có
    updatedAt: record.created,
  };
};

export const driverService = {
  
  /**
   * 1. Lấy danh sách tài xế (Có phân trang & Tìm kiếm)
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    // --- NHÁNH MOCK ---
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Drivers - Page: ${page}`);
      const start = (page - 1) * pageSize;
      const paginatedData = localDrivers.slice(start, start + pageSize);
      return mockDelay({
        data: paginatedData,
        total: localDrivers.length,
      });
    }

    // --- NHÁNH POCKETBASE ---
    try {
      // Logic tìm kiếm: Tìm theo Tên HOẶC Số điện thoại
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || phone ~ "${filters.search}"`;
      }

      const result = await pb.collection('drivers').getList(page, pageSize, {
        sort: '-created', // Mới nhất lên đầu
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách tài xế:", error);
      // Trả về rỗng để UI không bị crash
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Lấy chi tiết 1 tài xế
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const driver = localDrivers.find(d => d.id === id);
      return mockDelay(driver);
    }

    try {
      const record = await pb.collection('drivers').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy tài xế ${id}:`, error);
      throw error;
    }
  },

  /**
   * 3. Thêm tài xế mới
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Driver:', data);
      const newDriver = { ...data, id: `d${Date.now()}` };
      localDrivers.unshift(newDriver);
      return mockDelay(newDriver);
    }

    try {
      // Mapping NGƯỢC: UI -> DB
      const dbPayload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        license_number: data.licenseNumber, // UI gửi licenseNumber -> DB lưu license_number
        status: data.status || 'active',
        // avatar: data.avatarFile, // Nếu sau này có upload ảnh
      };

      const record = await pb.collection('drivers').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo tài xế:", error);
      throw error;
    }
  },

  /**
   * 4. Cập nhật tài xế
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      const index = localDrivers.findIndex(d => d.id === id);
      if (index > -1) {
        localDrivers[index] = { ...localDrivers[index], ...data };
        return mockDelay(localDrivers[index]);
      }
      return Promise.reject(new Error('Driver not found'));
    }

    try {
      // Chỉ gửi những trường có thay đổi
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.email && { email: data.email }),
        ...(data.licenseNumber && { license_number: data.licenseNumber }),
        ...(data.status && { status: data.status }),
      };

      const record = await pb.collection('drivers').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật tài xế ${id}:`, error);
      throw error;
    }
  },

  /**
   * 5. Xóa tài xế
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localDrivers = localDrivers.filter(d => d.id !== id);
      return mockDelay({ success: true });
    }

    return await pb.collection('drivers').delete(id);
  }
};