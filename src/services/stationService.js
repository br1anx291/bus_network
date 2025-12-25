import pb from '~/api/pocketbase'; 

const mapToUI = (record) => {
  return {
    id: record.id,
    name: record.name,
    address: record.address || '',
    lat: record.latitude || 0,
    lng: record.longitude || 0,
    status: record.status || 'Active',
    updatedAt: record.updated,
  };
};

export const stationService = {

  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || address ~ "${filters.search}"`;
      }

      const result = await pb.collection('stations').getList(page, pageSize, {
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách trạm:", error);
      return { data: [], total: 0 };
    }
  },

  getById: async (id) => {
    try {
      const record = await pb.collection('stations').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy trạm ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const dbPayload = {
        name: data.name,
        address: data.address,
        latitude: data.lat,
        longitude: data.lng, 
        status: data.status || 'Active',
      };

      const record = await pb.collection('stations').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo trạm:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.lat && { latitude: data.lat }),  
        ...(data.lng && { longitude: data.lng }), 
        ...(data.status && { status: data.status }),
      };

      const record = await pb.collection('stations').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật trạm ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    return await pb.collection('stations').delete(id);
  }
};