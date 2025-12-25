import pb from '~/api/pocketbase';

export const mapService = {
  
getBusLocations: async (routeId = null) => {
    try {
      console.log("DEBUG - Route ID nhận được:", routeId);
      let busFilter = 'status != "stopped"';
      
      if (routeId) {
        busFilter += ` && current_route = '${routeId}'`;
      }
      console.log("DEBUG - Câu lệnh Filter:", busFilter);
      const buses = await pb.collection('buses').getFullList({
        filter: busFilter,
        expand: 'driver,current_route',
      });
      console.log(`DEBUG - Tìm thấy ${buses.length} xe thuộc tuyến này`);

      if (!buses.length) return [];

      const locationPromises = buses.map(async (bus) => {
        try {
          const location = await pb.collection('bus_locations').getFirstListItem(
            `buses = "${bus.id}"`, 
            {
              sort: '-created',
            }
          );

          return {
            locationId: location.id,
            busId: bus.id,
            lat: location.latitude,
            lng: location.longitude,
            plate: bus.license_plate,
            status: bus.status,
            driver: bus.expand?.driver?.name,
            route: bus.expand?.current_route?.name,
            updatedAt: location.updated
          };
        } catch (err) {
          return null; 
        }
      });

      const results = await Promise.allSettled(locationPromises);
      
      const finalData = results
        .filter(res => res.status === 'fulfilled' && res.value !== null)
        .map(res => res.value);

      return finalData;

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