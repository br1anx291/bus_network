import pb from '~/api/pocketbase'; 

const mapToUI = (record) => {
  const expand = record.expand || {};
  const toArray = (data) => (Array.isArray(data) ? data : (data ? [data] : []));
  
  const routeInfo = toArray(expand.current_route)[0]; 
  const driverInfo = toArray(expand.driver)[0];    

  return {
    id: record.id,
    plate: record.license_plate, 
    model: record.name || 'Chưa cập nhật',
    capacity: record.capacity,
    status: record.status,
    updated: record.updated,

    routes: record.current_route, 
    routeName: routeInfo ? routeInfo.name : 'Chưa phân tuyến',

    driver: record.driver,
    driverName: driverInfo ? (driverInfo.name || driverInfo.email) : 'Chưa phân công',
  };
};

export const vehicleService = {

  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `license_plate ~ "${filters.search}"`;
      }

      const result = await pb.collection('buses').getList(page, pageSize, {
        sort: '-created',
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

  create: async (data) => {

    try {
      const dbPayload = {
        license_plate: data.plate,
        name: data.model,
        capacity: data.capacity,
        status: data.status || 'N/A',
        current_route: data.routes || null, 
        driver: data.driver || null,
      };

      const record = await pb.collection('buses').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo xe:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const dbPayload = {
        ...(data.plate && { license_plate: data.plate }),
        ...(data.model && { name: data.model }),
        ...(data.capacity && { capacity: data.capacity }),
        ...(data.status && { status: data.status }),
        ...(data.driver !== undefined && { driver: data.driver }),
        ...(data.routes !== undefined && { current_route: data.routes }),
      };

      const record = await pb.collection('buses').update(id, dbPayload);

      const expandedRecord = await pb.collection('buses').getOne(record.id, {
         expand: 'driver,current_route'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật xe ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await pb.collection('buses').delete(id);
    } catch (error) {
      console.error("[PocketBase] Lỗi xóa xe:", error);
      throw error;
    }
  }
};