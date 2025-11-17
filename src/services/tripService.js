// src/services/tripService.js
import { rawTripData } from '~/features/trips/data/tripMockData'; // <-- 1. SỬA IMPORT

// --- Giả lập Database (Lưu trong bộ nhớ) ---
let trips = [...rawTripData]; // <-- 2. SỬA TÊN BIẾN

// Giả lập độ trễ mạng (miligiây)
const MOCK_DELAY = 500;

// --- Hàm Helper (Giả lập Promise) ---
const mockApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, MOCK_DELAY);
  });
};

// --- Các hàm CRUD ---

/**
 * Lấy danh sách chuyến (có phân trang giả lập)
 */
const getTrips = (page = 1, pageSize = 7) => { // <-- 3. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: getTrips ---', { page, pageSize });

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const paginatedData = trips.slice(start, end); // <-- 4. SỬA TÊN BIẾN

  return mockApi({
    data: paginatedData,
    total: trips.length, // <-- 5. SỬA TÊN BIẾN
  });
};

/**
 * Xóa một chuyến dựa trên ID
 */
const deleteTrip = (id) => { // <-- 6. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: deleteTrip ---', { id });

  trips = trips.filter((t) => t.id !== id); // <-- 7. SỬA TÊN BIẾN

  return mockApi({ success: true });
};

/**
 * Thêm một chuyến mới
 */
const createTrip = (data) => { // <-- 8. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: createTrip ---', data);

  // Data giờ đã có 'routeName', 'vehiclePlate', 'driverName', 'startTime', 'endTime', 'status'
  const newTrip = {
    ...data,
    id: `t${new Date().getTime()}`, // Tạo ID giả
  };

  trips.unshift(newTrip); // <-- 9. SỬA TÊN BIẾN

  return mockApi({ success: true, trip: newTrip });
};

/**
 * Cập nhật một chuyến dựa trên ID
 */
const updateTrip = (id, data) => { // <-- 10. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: updateTrip ---', { id, data });

  let targetTrip = null;

  trips = trips.map((t) => { // <-- 11. SỬA TÊN BIẾN
    if (t.id === id) {
      targetTrip = { ...t, ...data }; // Cập nhật data
      return targetTrip;
    }
    return t;
  });

  if (targetTrip) {
    return mockApi({ success: true, trip: targetTrip });
  } else {
    return Promise.reject(new Error('Không tìm thấy chuyến để cập nhật'));
  }
};


// --- Xuất ra service ---
export const tripService = { // <-- 12. SỬA TÊN EXPORT
  getTrips,
  deleteTrip,
  createTrip,
  updateTrip,
};