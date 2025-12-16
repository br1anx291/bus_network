import pb from '~/api/pocketbase';
import { rawPassengerData } from '~/features/passengers/data/passengerMockData';

// --- CẤU HÌNH ---
// true: Dùng Mock (RAM) | false: Dùng API thật (PocketBase)
const USE_MOCK = false; 
const MOCK_DELAY = 500;

// --- KHO DATA GIẢ LẬP (BACKUP) ---
let localPassengers = [...rawPassengerData];

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
    name: record.name || 'Chưa cập nhật',
    email: record.email || '',
    phone: record.phone || '',
    address: record.address || '',
    
    // Status: active, blocked (khớp với options trong DB)
    status: record.status || 'active',
    
    // Avatar: Tạo URL đầy đủ để hiển thị ảnh
    avatar: record.avatar ? pb.files.getUrl(record, record.avatar) : null,
    
    created: record.created,
    updated: record.updated,
  };
};

export const passengerService = {
  
  /**
   * 1. Lấy danh sách hành khách (Phân trang & Tìm kiếm)
   */
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    // --- NHÁNH MOCK ---
    if (USE_MOCK) {
      console.log(`[MOCK API] Get Passengers - Page: ${page}`);
      const start = (page - 1) * pageSize;
      const paginatedData = localPassengers.slice(start, start + pageSize);
      return mockDelay({
        data: paginatedData,
        total: localPassengers.length,
      });
    }

    // --- NHÁNH POCKETBASE ---
    try {
      // Tìm kiếm theo Tên, Email hoặc Số điện thoại
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || email ~ "${filters.search}" || phone ~ "${filters.search}"`;
      }

      const result = await pb.collection('passengers').getList(page, pageSize, {
        sort: '-created', // Mới nhất lên đầu
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách hành khách:", error);
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Lấy chi tiết 1 hành khách
   */
  getById: async (id) => {
    if (USE_MOCK) {
      const passenger = localPassengers.find(p => p.id === id);
      return mockDelay(passenger);
    }

    try {
      const record = await pb.collection('passengers').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy hành khách ${id}:`, error);
      throw error;
    }
  },

  /**
   * 3. Thêm hành khách mới (CẬP NHẬT CHO AUTH COLLECTION)
   */
  create: async (data) => {
    if (USE_MOCK) {
      console.log('[MOCK API] Create Passenger:', data);
      const newPassenger = { ...data, id: `p${Date.now()}` };
      localPassengers.unshift(newPassenger);
      return mockDelay(newPassenger);
    }

    try {
      // Mật khẩu mặc định cho tất cả hành khách được tạo bởi Admin
      const DEFAULT_PASSWORD = '12345678';

      const dbPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        // Fix lỗi undefined: Nếu không có địa chỉ thì gửi chuỗi rỗng
        address: data.address || '', 
        status: data.status || 'active',

        // --- CÁC TRƯỜNG BẮT BUỘC CỦA AUTH COLLECTION ---
        password: DEFAULT_PASSWORD,
        passwordConfirm: DEFAULT_PASSWORD,
        emailVisibility: true, // Cho phép tìm kiếm/xem email công khai (tùy chọn)
      };

      const record = await pb.collection('passengers').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo hành khách:", error);
      throw error;
    }
  },

  /**
   * 4. Cập nhật hành khách
   */
  update: async (id, data) => {
    if (USE_MOCK) {
      const index = localPassengers.findIndex(p => p.id === id);
      if (index > -1) {
        localPassengers[index] = { ...localPassengers[index], ...data };
        return mockDelay(localPassengers[index]);
      }
      return Promise.reject(new Error('Passenger not found'));
    }

    try {
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        // Fix lỗi undefined khi update
        ...(data.address !== undefined && { address: data.address }), 
        ...(data.status && { status: data.status }),
      };

      const record = await pb.collection('passengers').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật hành khách ${id}:`, error);
      throw error;
    }
  },

  /**
   * 5. Xóa hành khách
   */
  delete: async (id) => {
    if (USE_MOCK) {
      localPassengers = localPassengers.filter(p => p.id !== id);
      return mockDelay({ success: true });
    }

    return await pb.collection('passengers').delete(id);
  }
};