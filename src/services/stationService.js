// src/services/stationService.js
import { rawStationData } from '~/features/stations/data/stationMockData'; // <-- 1. SỬA IMPORT

// --- Giả lập Database (Lưu trong bộ nhớ) ---
let stations = [...rawStationData]; // <-- 2. SỬA TÊN BIẾN

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
 * Lấy danh sách trạm (có phân trang giả lập)
 */
const getStations = (page = 1, pageSize = 7) => { // <-- 3. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: getStations ---', { page, pageSize });

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const paginatedData = stations.slice(start, end); // <-- 4. SỬA TÊN BIẾN

  return mockApi({
    data: paginatedData,
    total: stations.length, // <-- 5. SỬA TÊN BIẾN
  });
};

/**
 * Xóa một trạm dựa trên ID
 */
const deleteStation = (id) => { // <-- 6. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: deleteStation ---', { id });

  stations = stations.filter((s) => s.id !== id); // <-- 7. SỬA TÊN BIẾN

  return mockApi({ success: true });
};

/**
 * Thêm một trạm mới
 */
const createStation = (data) => { // <-- 8. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: createStation ---', data);

  // Data giờ đã có 'name', 'lat', 'lon', 'status'
  const newStation = {
    ...data,
    id: `s${new Date().getTime()}`, // Tạo ID giả
  };

  stations.unshift(newStation); // <-- 9. SỬA TÊN BIẾN

  return mockApi({ success: true, station: newStation });
};

/**
 * Cập nhật một trạm dựa trên ID
 */
const updateStation = (id, data) => { // <-- 10. SỬA TÊN HÀM
  console.log('--- MOCK SERVICE: updateStation ---', { id, data });

  let targetStation = null;

  stations = stations.map((s) => { // <-- 11. SỬA TÊN BIẾN
    if (s.id === id) {
      targetStation = { ...s, ...data }; // Cập nhật data
      return targetStation;
    }
    return s;
  });

  if (targetStation) {
    return mockApi({ success: true, station: targetStation });
  } else {
    return Promise.reject(new Error('Không tìm thấy trạm để cập nhật'));
  }
};


// --- Xuất ra service ---
export const stationService = { // <-- 12. SỬA TÊN EXPORT
  getStations,
  deleteStation,
  createStation,
  updateStation,
};