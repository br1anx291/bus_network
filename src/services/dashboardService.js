
import pb from '~/api/pocketbase';
const getCount = async (collection, filter = '') => {
  const result = await pb.collection(collection).getList(1, 1, {
    filter: filter,
    fields: 'id', 
  });
  return result.totalItems;
};

export const dashboardService = {

  getStats: async () => {
    try {

      const [
        activeBuses, 
        totalDrivers, 
        activeDrivers, 
        newIncidents, 
        pendingPickups
      ] = await Promise.all([
        getCount('buses', "status = 'active'"),
        
        getCount('drivers'), 
      
        getCount('drivers', "status = 'active'"),

        getCount('incidents', "status = 'pending' || status = 'processing'"),

        getCount('pickup_requests', "status = 'pending'"),
      ]);

      return {
        activeBuses,
        totalDrivers,
        activeDrivers,
        newIncidents,
        pendingPickups
      };
    } catch (error) {
      console.error("[Dashboard] Lỗi lấy thống kê:", error);

      return { 
        activeBuses: 0, 
        totalDrivers: 0, 
        activeDrivers: 0, 
        newIncidents: 0, 
        pendingPickups: 0 
      };
    }
  },

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

  getOnlineVehicles: async () => {
    try {
      const records = await pb.collection('bus_locations').getFullList({
        expand: 'buses', 
      });
      
      return records.map(rec => ({
        id: rec.id,
        lat: rec.latitude,
        lng: rec.longitude,
        busPlate: rec.expand?.buses?.license_plate || 'Unknown',
        busStatus: rec.expand?.buses?.status || 'offline',
        updated: rec.updated,
      }));
    } catch (error) {
      console.error("[Dashboard] Lỗi lấy vị trí xe:", error);
      return [];
    }
  },

  getRecentIncidents: async () => {
    try {
      const result = await pb.collection('incidents').getList(1, 5, {
        sort: '-created', 
        filter: "status = 'pending' || status = 'processing'",
        expand: 'related_bus', 
      });
      
      return result.items.map(item => ({
        id: item.id,
        type: 'incident',
        title: item.title,
        status: item.status, 
        severity: item.severity, 
        time: item.created,
        meta: item.expand?.related_bus?.license_plate || '---'
      }));
    } catch (error) {
      return [];
    }
  },


  getRecentPickups: async () => {
    try {
      const result = await pb.collection('pickup_requests').getList(1, 5, {
        sort: '-created_at',
        filter: "status = 'pending'", 
        expand: 'passenger,stations',
      });

      return result.items.map(item => ({
        id: item.id,
        type: 'pickup',
        status: item.status,
        time: item.created,
        customerName: item.expand?.passenger?.name || 'Khách vãng lai',
        customerPhone: item.expand?.passenger?.phone || '---',
        stationName: item.expand?.stations?.name || 'Điểm chưa xác định'
      }));
    } catch (error) {
        console.error("[Dashboard] Lỗi lấy yêu cầu đón:", error);
      return [];
    }
  }
};