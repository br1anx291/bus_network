import pb from '~/api/pocketbase';

// --- CẤU HÌNH ---
const USE_MOCK = false; 
const MOCK_DELAY = 500;

// Hàm Helper giả lập độ trễ (Giữ lại để debug nếu cần)
const mockDelay = (data) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
};

// --- [QUAN TRỌNG] HÀM MAPPING DỮ LIỆU ---
// Giữ nguyên logic mapping rất tốt này
const mapToUI = (record) => {
  const expand = record.expand || {};

  const toArray = (data) => (Array.isArray(data) ? data : (data ? [data] : []));

  const passenger = toArray(expand.passenger)[0];
  const station = toArray(expand.stations)[0];
  const trip = toArray(expand.trips)[0];
  const bus = toArray(expand.buses)[0];

  return {
    id: record.id,
    
    // 1. Thông tin trạng thái & thời gian
    status: record.status || 'pending', 
    createdAt: record.created_at,
    updated: record.updated,

    // 2. Thông tin Khách hàng
    userId: record.passenger,
    userName: passenger ? (passenger.name || passenger.username) : 'Khách vãng lai',
    userPhone: passenger ? passenger.phone : '---',
    // userAvatar: user ? passengers.avatar : null,

    // 3. Thông tin Điểm đón
    stationId: record.stations,
    stationName: station ? station.name : 'Điểm chưa xác định',
    stationAddress: station ? station.address : '',

    // 4. Thông tin Chuyến
    tripId: record.trips,
    tripStartTime: trip ? trip.start_time : null, 

    // 5. Thông tin Xe
    busId: record.buses,
    busPlate: bus ? bus.license_plate : 'Chưa điều xe',
  };
};

export const pickupRequestService = {
  
  /**
   * 1. Lấy danh sách yêu cầu
   * @param {number} page 
   * @param {number} pageSize 
   * @param {string} status - Trạng thái cần lọc (pending, accepted...). Nếu rỗng '' sẽ lấy tất cả.
   */
  getAll: async (page = 1, pageSize = 10, status = '') => {
    if (USE_MOCK) {
      return mockDelay({ data: [], total: 0 });
    }

    try {
      // --- XỬ LÝ BỘ LỌC STATUS ---
      // Nếu status có giá trị (vd: 'pending'), ta tạo chuỗi filter
      // Nếu status rỗng (''), ta để filterExpr rỗng -> lấy tất cả (cho Tab Lịch sử)
      let filterExpr = '';
      if (status) {
        filterExpr = `status = "${status}"`;
      }

      const result = await pb.collection('pickup_requests').getList(page, pageSize, {
        sort: '-created_at', 
        filter: filterExpr,   // Áp dụng bộ lọc tại đây
        expand: 'passenger,stations,trips,buses', 
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[Service] Lỗi lấy danh sách yêu cầu đón:", error);
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Cập nhật trạng thái (Duyệt / Từ chối / Hoàn thành)
   */
  updateStatus: async (id, newStatus) => {
    try {
      const record = await pb.collection('pickup_requests').update(id, {
        status: newStatus
      });
      
      const expandedRecord = await pb.collection('pickup_requests').getOne(record.id, {
        expand: 'passenger,stations,trips,buses'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[Service] Lỗi cập nhật trạng thái ${id}:`, error);
      throw error;
    }
  },

  /**
   * 3. Cập nhật thông tin khác
   */
  update: async (id, data) => {
    try {
      const record = await pb.collection('pickup_requests').update(id, data);
      
      const expandedRecord = await pb.collection('pickup_requests').getOne(record.id, {
        expand: 'passenger,stations,trips,buses'
      });
      
      return mapToUI(expandedRecord);
    } catch (error) {
      throw error;
    }
  },
};