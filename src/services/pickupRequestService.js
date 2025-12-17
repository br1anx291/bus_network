import pb from '~/api/pocketbase';

const mapToUI = (record) => {
  const expand = record.expand || {};
  const toArray = (data) => (Array.isArray(data) ? data : (data ? [data] : []));
  const passenger = toArray(expand.passenger)[0];
  const station = toArray(expand.stations)[0];
  const trip = toArray(expand.trips)[0];
  const bus = toArray(expand.buses)[0];

  return {
    id: record.id,

    status: record.status || 'pending', 
    createdAt: record.created_at,
    updated: record.updated,

    userId: record.passenger,
    userName: passenger ? (passenger.name || passenger.username) : 'Khách vãng lai',
    userPhone: passenger ? passenger.phone : '---',

    stationId: record.stations,
    stationName: station ? station.name : 'Điểm chưa xác định',
    stationAddress: station ? station.address : '',

    tripId: record.trips,
    tripStartTime: trip ? trip.start_time : null, 

    busId: record.buses,
    busPlate: bus ? bus.license_plate : 'Chưa điều xe',
  };
};

export const pickupRequestService = {
  getAll: async (page = 1, pageSize = 10, status = '') => {
    try {
      let filterExpr = '';
      if (status) {
        filterExpr = `status = "${status}"`;
      }

      const result = await pb.collection('pickup_requests').getList(page, pageSize, {
        sort: '-created_at', 
        filter: filterExpr,
        expand: 'passenger,stations,trips,buses', 
      });

      return {
        data: result.items.map(mapToUI),
        total: result.totalItems
      };
    } catch (error) {
      console.error("[Service] Lỗi lấy danh sách yêu cầu đón:", error);
      return { data: [], total: 0 };
    }
  },

  updateStatus: async (id, newStatus) => {
    try {
      const record = await pb.collection('pickup_requests').update(id, {
        status: newStatus
      });
      
      const expandedRecord = await pb.collection('pickup_requests').getOne(record.id, {
        expand: 'passenger,stations,trips,buses'
      });

      return mapToUI(expandedRecord);
    } catch (error) {
      console.error(`[Service] Lỗi cập nhật trạng thái ${id}:`, error);
      throw error;
    }
  },


  update: async (id, data) => {
    try {
      const record = await pb.collection('pickup_requests').update(id, data);
      
      const expandedRecord = await pb.collection('pickup_requests').getOne(record.id, {
        expand: 'passenger,stations,trips,buses'
      });
      
      return mapToUI(expandedRecord);
    } catch (error) {
      throw error;
    }
  },
};