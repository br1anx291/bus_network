import pb from '~/api/pocketbase';

const mapToUI = (record) => {
  const expand = record.expand || {};
  const toArray = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  };

  const buses = toArray(expand.buses);
  const routes = toArray(expand.routes);

  return {
    id: record.id,
    busId: record.buses, 
    busName: buses.length > 0 
      ? buses.map(b => `${b.license_plate}`).join(', ') 
      : 'Chưa gán xe',

    routeId: record.routes,
    routeName: routes.length > 0 
      ? routes.map(r => r.name).join(', ') 
      : 'Chưa gán tuyến',

    startTime: record.start_time,
    endTime: record.end_time,
    status: record.status || 'scheduled',
    created: record.created,
    updated: record.updated,
  };
};

export const tripService = {

  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      let filterExpr = '';
      if (filters.status) {
        filterExpr = `status = "${filters.status}"`;
      }

      const result = await pb.collection('trips').getList(page, pageSize, {
        sort: '-start_time',      
        filter: filterExpr,
        expand: 'buses,routes',   
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách chuyến:", error);
      return { data: [], total: 0 };
    }
  },

  getById: async (id) => {
    try {
      const record = await pb.collection('trips').getOne(id, {
        expand: 'buses,routes',
      });
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy chuyến ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {


    try {
      const record = await pb.collection('trips').create(data);
      const expandedRecord = await pb.collection('trips').getOne(record.id, {
        expand: 'buses,routes'
      });
      
      return mapToUI(expandedRecord);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo chuyến:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const record = await pb.collection('trips').update(id, data);

      const expandedRecord = await pb.collection('trips').getOne(record.id, {
        expand: 'buses,routes'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật chuyến ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    return await pb.collection('trips').delete(id);
  }
};