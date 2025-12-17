import pb from '~/api/pocketbase';

const USE_MOCK = false; 

const mapToUI = (record) => {
  const expand = record.expand || {};

  return {
    id: record.id,
    title: record.title,
    description: record.description,

    category: record.category || 'other',
    severity: record.severity || 'low',
    status: record.status || 'pending',

    busId: record.related_bus,
    busPlate: expand.related_bus ? expand.related_bus.license_plate : '---',

    driverId: record.related_driver,
    driverName: expand.related_driver ? expand.related_driver.name : '---',
    
    routeId: record.related_route,
    routeName: expand.related_route ? expand.related_route.name : '---',

    createdAt: record.created,
    updatedAt: record.updated,
  };
};

export const incidentService = {
  
  getAll: async (page = 1, pageSize = 10) => {
    try {
      const result = await pb.collection('incidents').getList(page, pageSize, {
        sort: '-created',
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


  create: async (data) => {
    try {
      const dbPayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        severity: data.severity,
        status: data.status || 'pending',
        
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

  update: async (id, data) => {
    try {
      const dbPayload = {};
      if (data.title) dbPayload.title = data.title;
      if (data.description) dbPayload.description = data.description;
      if (data.category) dbPayload.category = data.category;
      if (data.severity) dbPayload.severity = data.severity;
      if (data.status) dbPayload.status = data.status;

      if (data.busId !== undefined) dbPayload.related_bus = data.busId;
      if (data.driverId !== undefined) dbPayload.related_driver = data.driverId;
      if (data.routeId !== undefined) dbPayload.related_route = data.routeId;

      const record = await pb.collection('incidents').update(id, dbPayload);

      const expandedRecord = await pb.collection('incidents').getOne(record.id, {
        expand: 'related_bus,related_driver,related_route'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[IncidentService] Lỗi cập nhật ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await pb.collection('incidents').delete(id);
    } catch (error) {
      console.error("[IncidentService] Lỗi xóa:", error);
      throw error;
    }
  }
};