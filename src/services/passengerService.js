// src/services/passengerService.js
import { rawPassengerData } from '~/features/passengers/data/passengerMockData'; // <-- 1. SỬA IMPORT

// --- Giả lập Database ---
let passengers = [...rawPassengerData]; // <-- 2. SỬA TÊN BIẾN

const MOCK_DELAY = 500;

const mockApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- Các hàm CRUD ---

const getPassengers = (page = 1, pageSize = 7) => { // <-- 3. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: getPassengers ---', { page, pageSize });
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const paginatedData = passengers.slice(start, end); // <-- 4. SỬA TÊN BIẾN
  return mockApi({
    data: paginatedData,
    total: passengers.length, // <-- 5. SỬA TÊN BIẾN
  });
};

const deletePassenger = (id) => { // <-- 6. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: deletePassenger ---', { id });
  passengers = passengers.filter((p) => p.id !== id); // <-- 7. SỬA TÊN BIẾN
  return mockApi({ success: true });
};

const createPassenger = (data) => { // <-- 8. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: createPassenger ---', data);
  const newPassenger = {
    ...data,
    id: `p${new Date().getTime()}`,
  };
  passengers.unshift(newPassenger); // <-- 9. SỬA TÊN BIẾN
  return mockApi({ success: true, passenger: newPassenger });
};

const updatePassenger = (id, data) => { // <-- 10. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: updatePassenger ---', { id, data });
  let targetPassenger = null;
  passengers = passengers.map((p) => { // <-- 11. SỬA TÊN BIẾN
    if (p.id === id) {
      targetPassenger = { ...p, ...data };
      return targetPassenger;
    }
    return p;
  });
  if (targetPassenger) {
    return mockApi({ success: true, passenger: targetPassenger });
  } else {
    return Promise.reject(new Error('Không tìm thấy hành khách để cập nhật'));
  }
};

// --- Xuất ra service ---
export const passengerService = { // <-- 12. SỬA TÊN EXPORT
  getPassengers,
  deletePassenger,
  createPassenger,
  updatePassenger,
};