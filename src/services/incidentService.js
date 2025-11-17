// src/services/incidentService.js
import { rawIncidentData } from '~/features/incidents/data/incidentMockData';

let incidents = [...rawIncidentData];
const MOCK_DELAY = 500;

const mockApi = (data) => {
  // ... (giữ nguyên)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

const getIncidents = (page = 1, pageSize = 7) => {
  // ... (giữ nguyên)
  console.log('--- MOCK SERVICE: getIncidents ---', { page, pageSize });
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const paginatedData = incidents.slice(start, end);
  return mockApi({
    data: paginatedData,
    total: incidents.length,
  });
};

// --- THÊM HÀM MỚI Ở ĐÂY ---
const updateIncidentCompletion = (id, isCompleted) => {
  console.log('--- MOCK SERVICE: updateIncidentCompletion ---', { id, isCompleted });

  let targetIncident = null;
  incidents = incidents.map((item) => {
    if (item.id === id) {
      // Cập nhật trạng thái hoàn thành VÀ đổi trạng thái text (nếu cần)
      targetIncident = { 
        ...item, 
        isCompleted: isCompleted,
        status: isCompleted ? 'Đã xử lý' : 'Mới' // <-- Logic nghiệp vụ tự định nghĩa
      };
      return targetIncident;
    }
    return item;
  });

  if (targetIncident) {
    return mockApi({ success: true, incident: targetIncident });
  } else {
    return Promise.reject(new Error('Không tìm thấy sự cố để cập nhật'));
  }
};
// --- HẾT PHẦN THÊM ---


// --- CẬP NHẬT EXPORT ---
export const incidentService = {
  getIncidents,
  updateIncidentCompletion, // <-- Thêm vào export
};