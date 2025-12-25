import pb from '~/api/pocketbase';

const mapToUI = (record) => {
  return {
    id: record.id,
    name: record.name || 'Chưa cập nhật',
    email: record.email || '',
    phone: record.phone || '',
    address: record.address || '',
    status: record.status || 'active',
    avatar: record.avatar ? pb.files.getUrl(record, record.avatar) : null,
    created: record.created,
    updated: record.updated,
  };
};

export const passengerService = {
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || email ~ "${filters.search}" || phone ~ "${filters.search}"`;
      }

      const result = await pb.collection('passengers').getList(page, pageSize, {
        sort: '-created',
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách hành khách:", error);
      return { data: [], total: 0 };
    }
  },

  getById: async (id) => {
    try {
      const record = await pb.collection('passengers').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy hành khách ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const DEFAULT_PASSWORD = '12345678';
      const dbPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || '', 
        status: data.status || 'active',

        password: DEFAULT_PASSWORD,
        passwordConfirm: DEFAULT_PASSWORD,
        emailVisibility: true,
      };

      const record = await pb.collection('passengers').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo hành khách:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }), 
        ...(data.status && { status: data.status }),
      };

      const record = await pb.collection('passengers').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật hành khách ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    return await pb.collection('passengers').delete(id);
  }
};