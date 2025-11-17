// src/services/pickupRequestService.js
import { rawPickupRequestData } from '~/features/pickupRequests/data/pickupRequestMockData';

let pickupRequests = [...rawPickupRequestData];

const MOCK_DELAY = 500;

const mockApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

const getPickupRequests = (page = 1, pageSize = 7) => {
  console.log('--- MOCK SERVICE: getPickupRequests ---', { page, pageSize });
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const paginatedData = pickupRequests.slice(start, end);
  return mockApi({
    data: paginatedData,
    total: pickupRequests.length,
  });
};

// --- THÊM HÀM MỚI Ở ĐÂY ---
const updatePickupRequestStatus = (id, newStatus) => {
  console.log('--- MOCK SERVICE: updatePickupRequestStatus ---', { id, newStatus });

  let targetRequest = null;
  pickupRequests = pickupRequests.map((req) => {
    if (req.id === id) {
      targetRequest = { ...req, status: newStatus };
      return targetRequest;
    }
    return req;
  });

  if (targetRequest) {
    return mockApi({ success: true, request: targetRequest });
  } else {
    return Promise.reject(new Error('Không tìm thấy yêu cầu để cập nhật'));
  }
};
// --- HẾT PHẦN THÊM ---


// --- CẬP NHẬT EXPORT ---
export const pickupRequestService = {
  getPickupRequests,
  updatePickupRequestStatus, // <-- Thêm vào export
};