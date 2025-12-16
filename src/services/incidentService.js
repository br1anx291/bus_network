// src/services/incidentService.js
import pb from '~/api/pocketbase';

// --- CẤU HÌNH ---
const USE_MOCK = false; // Chuyển sang FALSE để chạy thật

// --- HÀM MAPPING (Cầu nối DB -> UI) ---
// Giúp làm phẳng dữ liệu từ các bảng liên quan (Drivers, Buses, Routes)
const mapToUI = (record) => {
  const expand = record.expand || {}; // Lấy dữ liệu mở rộng

  return {
    id: record.id,
    
    // 1. Thông tin chính
    title: record.title,
    description: record.description,
    
    // 2. Phân loại & Mức độ
    category: record.category || 'other',
    severity: record.severity || 'low',
    
    // 3. Trạng thái (pending, processing, resolved)
    status: record.status || 'pending',

    // 4. Thông tin liên quan (Đã flatten để hiển thị lên bảng dễ dàng)
    // - Xe buýt
    busId: record.related_bus,
    busPlate: expand.related_bus ? expand.related_bus.license_plate : '---',
    
    // - Tài xế (Đổi từ User sang Driver theo yêu cầu mới)
    driverId: record.related_driver,
    driverName: expand.related_driver ? expand.related_driver.name : '---',
    
    // - Tuyến
    routeId: record.related_route,
    routeName: expand.related_route ? expand.related_route.name : '---',

    // 5. Thời gian
    createdAt: record.created,
    updatedAt: record.updated,
  };
};

export const incidentService = {
  
  /**
   * 1. Lấy danh sách sự cố
   * Có expand để lấy chi tiết Xe, Tài xế, Tuyến
   */
  getAll: async (page = 1, pageSize = 10) => {
    if (USE_MOCK) return { data: [], total: 0 };

    try {
      const result = await pb.collection('incidents').getList(page, pageSize, {
        sort: '-created', // Mới nhất lên đầu
        // [QUAN TRỌNG] Expand để lấy dữ liệu liên kết
        expand: 'related_bus,related_driver,related_route', 
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[IncidentService] Lỗi lấy danh sách:", error);
      return { data: [], total: 0 };
    }
  },

  /**
   * 2. Tạo sự cố mới
   */
  create: async (data) => {
    try {
      const dbPayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        severity: data.severity,
        status: data.status || 'pending',
        
        // Các trường relation (Chỉ gửi ID)
        related_bus: data.busId,
        related_driver: data.driverId,
        related_route: data.routeId,
      };

      const record = await pb.collection('incidents').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[IncidentService] Lỗi tạo sự cố:", error);
      throw error;
    }
  },

  /**
   * 3. Cập nhật sự cố (Bao gồm cả đổi trạng thái và nội dung)
   * Thay thế cho hàm updateCompletion cũ
   */
  update: async (id, data) => {
    try {
      // Chuẩn bị payload, chỉ lấy những gì cần thiết
      const dbPayload = {};
      if (data.title) dbPayload.title = data.title;
      if (data.description) dbPayload.description = data.description;
      if (data.category) dbPayload.category = data.category;
      if (data.severity) dbPayload.severity = data.severity;
      if (data.status) dbPayload.status = data.status;
      
      // Relation
      if (data.busId !== undefined) dbPayload.related_bus = data.busId;
      if (data.driverId !== undefined) dbPayload.related_driver = data.driverId;
      if (data.routeId !== undefined) dbPayload.related_route = data.routeId;

      const record = await pb.collection('incidents').update(id, dbPayload);
      
      // Lấy lại data mới nhất kèm expand để update UI mượt mà
      const expandedRecord = await pb.collection('incidents').getOne(record.id, {
        expand: 'related_bus,related_driver,related_route'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[IncidentService] Lỗi cập nhật ${id}:`, error);
      throw error;
    }
  },

  /**
   * 4. Xóa sự cố
   */
  delete: async (id) => {
    try {
      return await pb.collection('incidents').delete(id);
    } catch (error) {
      console.error("[IncidentService] Lỗi xóa:", error);
      throw error;
    }
  }
};