// src/services/routeService.js

import pb from '~/api/pocketbase';

const mapToUI = (record) => {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    code: record.code || 'N/A', 
    status: record.status || 'NULL',
    path: record.path_json || [], 
    totalStops: 0, 
    updatedAt: record.updated,
  };
};

export const routeService = {

  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      let filterExpr = '';
      if (filters.search) {
        filterExpr = `name ~ "${filters.search}" || code ~ "${filters.search}"`;
      }

      const result = await pb.collection('routes').getList(page, pageSize, {
        sort: '-created',
        filter: filterExpr,
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[PocketBase] Lỗi lấy danh sách tuyến:", error);
      return { data: [], total: 0 };
    }
  },

  getById: async (id) => {
    try {
      const record = await pb.collection('routes').getOne(id);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi lấy tuyến ${id}:`, error);
      throw error;
    }
  },

  getStationsByRoute: async (routeId) => {
      try {
        const records = await pb.collection('route_stations').getFullList({
          filter: `routes = "${routeId}"`, 
          fields: 'stations',
        });

        return records.map(rec => rec.stations);
      } catch (error) {
        console.error("[RouteService] Lỗi lấy trạm theo tuyến:", error);
        return [];
      }
  },

  create: async (data) => {
    try {
      const dbPayload = {
        name: data.name,
        description: data.description,
        code: data.code,  
        status: data.status,
        path_json: [], 
      };

      const record = await pb.collection('routes').create(dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error("[PocketBase] Lỗi tạo tuyến:", error);
      throw error;
    }
  },

  update: async (id, data) => {

    try {
      const dbPayload = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.code && { code: data.code }),
        ...(data.status && { status: data.status }),
        ...(data.path_json && { path_json: data.path_json }),
      };

      const record = await pb.collection('routes').update(id, dbPayload);
      return mapToUI(record);
    } catch (error) {
      console.error(`[PocketBase] Lỗi cập nhật tuyến ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    return await pb.collection('routes').delete(id);
  },

  updateRouteStations: async (routeId, stationIds) => {
    try {
      const oldLinks = await pb.collection('route_stations').getFullList({
        filter: `routes = "${routeId}"`,
      });

      await Promise.all(oldLinks.map(link => pb.collection('route_stations').delete(link.id)));

      const createPromises = stationIds.map((stationId, index) => {
        return pb.collection('route_stations').create({
          routes: routeId,
          stations: stationId,
          stop_order: index + 1, 
        });
      });

      await Promise.all(createPromises);
      
      return true;
    } catch (error) {
      console.error("Lỗi cập nhật trạm cho tuyến:", error);
      throw error;
    }
  }
};