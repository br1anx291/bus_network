// src/services/mapService.js
import pb from '~/api/pocketbase';

export const mapService = {
  
  /**
   * 1. Lấy vị trí mới nhất của TẤT CẢ xe
   * LOGIC MỚI: Chỉ lấy record mới nhất cho mỗi xe
   */
  getBusLocations: async () => {
    try {
      // B1: Lấy danh sách location, sắp xếp MỚI NHẤT lên đầu (-created)
      const records = await pb.collection('bus_locations').getFullList({
        sort: '-created', 
    filter: "buses != '' ", // Chỉ lấy xe active
      expand: 'buses.driver,buses.current_route', // <--- QUAN TRỌNG NHẤT
      });

      // B2: Lọc trùng (Chỉ giữ lại bản ghi đầu tiên tìm thấy của mỗi xe)
      const uniqueBusMap = new Map();

      for (const rec of records) {
        const busInfo = rec.expand?.buses;
        // Nếu record lỗi (không có thông tin xe) -> Bỏ qua
        if (!busInfo) continue;

        const busId = busInfo.id;

        // Kiểm tra: Nếu trong danh sách kết quả CHƯA CÓ xe này -> Thêm vào
        // (Vì list đã sort theo thời gian, nên gặp lần đầu tiên chắc chắn là mới nhất)
        if (!uniqueBusMap.has(busId)) {
          uniqueBusMap.set(busId, rec);
        }
        // Nếu ĐÃ CÓ rồi -> Bỏ qua (Đây là record cũ hơn)
      }

      // B3: Chuyển đổi Map thành Mảng và Map sang format UI
      // Array.from(uniqueBusMap.values()) sẽ lấy ra danh sách các record duy nhất
      return Array.from(uniqueBusMap.values()).map(rec => {
        const busInfo = rec.expand?.buses;

        return {
          locationId: rec.id,       
          busId: busInfo.id,        
          
          // Toạ độ (Nhớ là lng nhé!)
          lat: rec.latitude,
          lng: rec.longitude,
          
          plate: busInfo.license_plate, 
          status: busInfo.status,       
          driver: busInfo.expand?.driver.name,
          route: busInfo.expand?.current_route.name,
          updatedAt: rec.updated
        };
      });

    } catch (error) {
      console.error("[MapService] Lỗi lấy vị trí xe:", error);
      return []; 
    }
  },

  /**
   * 2. Giữ nguyên hàm này
   */
  getRoutePath: async (routeId) => {
    try {
      const record = await pb.collection('routes').getOne(routeId);
      return record.path_json || []; 
    } catch (error) {
      return [];
    }
  }
};