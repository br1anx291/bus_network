import pb from '~/api/pocketbase';

export const mapService = {
  
  getBusLocations: async () => {
    try {
      const records = await pb.collection('bus_locations').getFullList({
        sort: '-created', 
        filter: "buses != '' ", 
        expand: 'buses.driver,buses.current_route', 
      });

      const uniqueBusMap = new Map();

      for (const rec of records) {
        const busInfo = rec.expand?.buses;
        if (!busInfo) continue;

        const busId = busInfo.id;
        if (!uniqueBusMap.has(busId)) {
          uniqueBusMap.set(busId, rec);
        }
      }

      return Array.from(uniqueBusMap.values()).map(rec => {
        const busInfo = rec.expand?.buses;
        return {
          locationId: rec.id,       
          busId: busInfo.id,        
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

  getRoutePath: async (routeId) => {
    try {
      const record = await pb.collection('routes').getOne(routeId);
      return record.path_json || []; 
    } catch (error) {
      return [];
    }
  }
};