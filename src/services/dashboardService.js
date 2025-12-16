// src/services/dashboardService.js
import pb from '~/api/pocketbase';

// --- HÀM HELPER ---
// Giúp lấy số lượng bản ghi (Total count) mà không cần lấy toàn bộ dữ liệu (tiết kiệm băng thông)
const getCount = async (collection, filter = '') => {
  const result = await pb.collection(collection).getList(1, 1, {
    filter: filter,
    fields: 'id', // Chỉ lấy ID cho nhẹ
  });
  return result.totalItems;
};

export const dashboardService = {
  
  /**
   * 1. LẤY THẺ THỐNG KÊ (STAT CARDS)
   * Gọi song song API để đếm số lượng
   * Cập nhật: Thêm đếm activeDrivers
   */
  getStats: async () => {
    try {
      // Dùng Promise.all để chạy song song các tác vụ => Tốc độ nhanh
      const [
        activeBuses, 
        totalDrivers, 
        activeDrivers, // <--- BỔ SUNG: Biến chứa số tài xế active
        newIncidents, 
        pendingPickups
      ] = await Promise.all([
        // 1. Xe đang hoạt động (Status = 'active')
        getCount('buses', "status = 'active'"),
        
        // 2. Tổng tài xế
        getCount('drivers'), 
        // 3. Tài xế đang hoạt động (Status = 'active')
        getCount('drivers', "status = 'active'"),

        // 4. Sự cố mới (Status = 'pending')
        getCount('incidents', "status = 'pending' || status = 'processing'"),

        // 5. Yêu cầu đón chưa xử lý (Status = 'pending')
        getCount('pickup_requests', "status = 'pending'"),
      ]);

      return {
        activeBuses,
        totalDrivers,
        activeDrivers, // <--- TRẢ VỀ THÊM TRƯỜNG NÀY
        newIncidents,
        pendingPickups
      };
    } catch (error) {
      console.error("[Dashboard] Lỗi lấy thống kê:", error);
      // Trả về mặc định 0 nếu lỗi
      return { 
        activeBuses: 0, 
        totalDrivers: 0, 
        activeDrivers: 0, // <--- Bổ sung default
        newIncidents: 0, 
        pendingPickups: 0 
      };
    }
  },

  /**
   * 2. LẤY DỮ LIỆU BIỂU ĐỒ TRÒN (VEHICLE STATUS)
   * (Giữ nguyên không đổi)
   */
  getVehicleStatusStats: async () => {
    try {
      const [active, maintenance, offline] = await Promise.all([
        getCount('buses', "status = 'active'"),
        getCount('buses', "status = 'maintenance'"),
        getCount('buses', "status = 'offline'"),
      ]);

      return [
        { type: 'Đang chạy', value: active },
        { type: 'Bảo trì',   value: maintenance },
        { type: 'Ngoại tuyến', value: offline },
      ];
    } catch (error) {
      return [];
    }
  },

  /**
   * 3. LẤY VỊ TRÍ XE (LIVE MAP)
   * (Giữ nguyên không đổi - dù Map đang tự fetch nhưng giữ lại để fallback hoặc dùng chỗ khác)
   */
  getOnlineVehicles: async () => {
    try {
      const records = await pb.collection('bus_locations').getFullList({
        expand: 'buses', // Lấy thông tin biển số, trạng thái xe
      });
      
      // Map dữ liệu cho gọn
      return records.map(rec => ({
        id: rec.id,
        lat: rec.latitude,
        lng: rec.longitude,
        // Thông tin xe (nếu có relation)
        busPlate: rec.expand?.buses?.license_plate || 'Unknown',
        busStatus: rec.expand?.buses?.status || 'offline',
        updated: rec.updated,
      }));
    } catch (error) {
      console.error("[Dashboard] Lỗi lấy vị trí xe:", error);
      return [];
    }
  },

  /**
   * 4. LẤY SỰ CỐ GẦN ĐÂY (CHO TAB 1)
   * (Giữ nguyên không đổi)
   */
  getRecentIncidents: async () => {
    try {
      const result = await pb.collection('incidents').getList(1, 5, {
        sort: '-created', // Mới nhất
        filter: "status = 'pending' || status = 'processing'", // Chỉ lấy cái chưa xong
        expand: 'related_bus', // Lấy biển số xe
      });
      
      return result.items.map(item => ({
        id: item.id,
        type: 'incident',
        title: item.title,
        status: item.status, // pending, processing...
        severity: item.severity, // low, medium, high
        time: item.created,
        meta: item.expand?.related_bus?.license_plate || '---'
      }));
    } catch (error) {
      return [];
    }
  },

  /**
   * 5. LẤY YÊU CẦU ĐÓN GẦN ĐÂY (CHO TAB 2)
   * (Giữ nguyên không đổi)
   */
  getRecentPickups: async () => {
    try {
      const result = await pb.collection('pickup_requests').getList(1, 5, {
        sort: '-created_at',
        filter: "status = 'pending'", // Chỉ lấy yêu cầu mới
        expand: 'passenger,stations', // Lấy thông tin khách và trạm
      });

      return result.items.map(item => ({
        id: item.id,
        type: 'pickup',
        status: item.status,
        time: item.created,
        // Thông tin khách hàng
        customerName: item.expand?.passenger?.name || 'Khách vãng lai',
        customerPhone: item.expand?.passenger?.phone || '---',
        // Thông tin điểm đón
        stationName: item.expand?.stations?.name || 'Điểm chưa xác định'
      }));
    } catch (error) {
        console.error("[Dashboard] Lỗi lấy yêu cầu đón:", error);
      return [];
    }
  }
};