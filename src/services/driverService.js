import pb from '~/api/pocketbase';

const mapToUI = (record) => {
  return {
    id: record.id,
    name: record.name,
    email: record.email || '',
    phone: record.phone || '',
    licenseNumber: record.license_number || '', 
    status: record.status || 'active',
    updatedAt: record.created,
  };
};

export const driverService = {
  
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || phone ~ "${filters.search}"`;
      }

      const result = await pb.collection('drivers').getList(page, pageSize, {
        sort: '-created',
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách tài xế:", error);
      return { data: [], total: 0 };
    }
  },

  getById: async (id) => {
    try {
      const record = await pb.collection('drivers').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy tài xế ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const dbPayload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        license_number: data.licenseNumber,
        status: data.status || 'active',
      };

      const record = await pb.collection('drivers').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo tài xế:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.email && { email: data.email }),
        ...(data.licenseNumber && { license_number: data.licenseNumber }),
        ...(data.status && { status: data.status }),
      };

      const record = await pb.collection('drivers').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật tài xế ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    return await pb.collection('drivers').delete(id);
  }
};