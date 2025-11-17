// src/features/analytics/data/analyticsMockData.js

// --- ĐỊNH NGHĨA DATA CHI TIẾT ---
// (Đây là "database" giả lập của chúng ta)
const analyticsDatabase = {
  // 'all' = Tất cả các tuyến
  'all': {
    'weekly': {
      performance: [
        { day: 'Thứ 2', tuanNay: 95, tuanTruoc: 90 },
        { day: 'Thứ 3', tuanNay: 92, tuanTruoc: 91 },
        { day: 'Thứ 4', tuanNay: 94, tuanTruoc: 88 },
        { day: 'Thứ 5', tuanNay: 90, tuanTruoc: 89 },
        { day: 'Thứ 6', tuanNay: 93, tuanTruoc: 90 },
        { day: 'Thứ 7', tuanNay: 98, tuanTruoc: 95 },
        { day: 'Chủ nhật', tuanNay: 99, tuanTruoc: 96 },
      ],
      performanceXKey: 'day',
      pickup: [
        { stationName: 'Trạm Bến Thành', count: 180 },
        { stationName: 'Trạm Chợ Lớn', count: 100 },
        { stationName: 'Trạm ĐH Bách Khoa', count: 80 },
        { stationName: 'Trạm Lotte Mart', count: 40 },
        { stationName: 'Trạm CV 23/9', count: 20 },
      ],
      incident: [
        { type: 'Mất tín hiệu GPS', count: 45 },
        { type: 'Tài xế báo hỏng phanh', count: 30 },
        { type: 'Xe lạc tuyến', count: 18 },
        { type: 'Hủy chuyến (hệ thống)', count: 7 },
      ],
    },
    'monthly': {
      performance: [
        { day: 'Tuần 1', tuanNay: 92, tuanTruoc: 85 },
        { day: 'Tuần 2', tuanNay: 94, tuanTruoc: 88 },
        { day: 'Tuần 3', tuanNay: 91, tuanTruoc: 90 },
        { day: 'Tuần 4', tuanNay: 95, tuanTruoc: 92 },
      ],
      performanceXKey: 'day', // Vẫn dùng 'day' làm key
      pickup: [
        { stationName: 'Trạm Bến Thành', count: 750 },
        { stationName: 'Trạm Chợ Lớn', count: 420 },
        { stationName: 'Trạm ĐH Bách Khoa', count: 310 },
        { stationName: 'Trạm Lotte Mart', count: 150 },
        { stationName: 'Trạm CV 23/9', count: 90 },
      ],
      incident: [
        { type: 'Mất tín hiệu GPS', count: 180 },
        { type: 'Tài xế báo hỏng phanh', count: 110 },
        { type: 'Xe lạc tuyến', count: 65 },
        { type: 'Hủy chuyến (hệ thống)', count: 30 },
      ],
    }
  },
  // 'r1' = Data giả lập cho Tuyến 01
  'r1': {
    'weekly': {
      performance: [
        { day: 'Thứ 2', tuanNay: 98, tuanTruoc: 95 },
        { day: 'Thứ 3', tuanNay: 97, tuanTruoc: 96 },
        { day: 'Thứ 4', tuanNay: 98, tuanTruoc: 97 },
        { day: 'Thứ 5', tuanNay: 96, tuanTruoc: 95 },
        { day: 'Thứ 6', tuanNay: 97, tuanTruoc: 96 },
        { day: 'Thứ 7', tuanNay: 99, tuanTruoc: 98 },
        { day: 'Chủ nhật', tuanNay: 99, tuanTruoc: 99 },
      ],
      performanceXKey: 'day',
      pickup: [
        { stationName: 'Trạm Chợ Lớn', count: 100 },
        { stationName: 'Bến xe Miền Tây', count: 50 },
      ],
      incident: [
        { type: 'Mất tín hiệu GPS', count: 10 },
        { type: 'Tài xế báo hỏng phanh', count: 5 },
      ],
    },
    'monthly': {
      performance: [
        { day: 'Tuần 1', tuanNay: 97, tuanTruoc: 90 },
        { day: 'Tuần 2', tuanNay: 98, tuanTruoc: 92 },
        { day: 'Tuần 3', tuanNay: 96, tuanTruoc: 91 },
        { day: 'Tuần 4', tuanNay: 98, tuanTruoc: 95 },
      ],
      performanceXKey: 'day',
      pickup: [
        { stationName: 'Trạm Chợ Lớn', count: 420 },
        { stationName: 'Bến xe Miền Tây', count: 210 },
      ],
      incident: [
        { type: 'Mất tín hiệu GPS', count: 40 },
        { type: 'Tài xế báo hỏng phanh', count: 20 },
      ],
    }
  },
  // 'r2' = Data giả lập cho Tuyến 05
  'r2': {
    'weekly': {
      performance: [
        { day: 'Thứ 2', tuanNay: 92, tuanTruoc: 88 },
        { day: 'Thứ 3', tuanNay: 90, tuanTruoc: 89 },
        { day: 'Thứ 4', tuanNay: 91, tuanTruoc: 85 },
        { day: 'Thứ 5', tuanNay: 88, tuanTruoc: 86 },
        { day: 'Thứ 6', tuanNay: 90, tuanTruoc: 87 },
        { day: 'Thứ 7', tuanNay: 95, tuanTruoc: 92 },
        { day: 'Chủ nhật', tuanNay: 96, tuanTruoc: 94 },
      ],
      performanceXKey: 'day',
      pickup: [
        { stationName: 'Trạm Bến Thành', count: 110 },
        { stationName: 'Trạm ĐH Bách Khoa', count: 80 },
        { stationName: 'Trạm Đầm Sen', count: 40 },
      ],
      incident: [
        { type: 'Mất tín hiệu GPS', count: 20 },
        { type: 'Xe lạc tuyến', count: 15 },
      ],
    },
    'monthly': {
      // ... (Bạn có thể thêm data tháng cho r2 nếu muốn)
      // Tạm thời dùng data tuần để minh họa

    }
  },
};
analyticsDatabase.r2.monthly = { ...analyticsDatabase.r2.weekly };
// --- HÀM XUẤT KHẨU ---
/**
 * Lấy data phân tích dựa trên bộ lọc
 * @param {string} timeRange - 'Tuần này' hoặc 'Tháng này'
 * @param {string | null} routeId - ID của tuyến (ví dụ: 'r1') hoặc null (tất cả)
 * @returns {object} - { performance, performanceXKey, pickup, incident }
 */
export const getAnalyticsData = (timeRange, routeId) => {
  const routeKey = routeId || 'all';
  const timeKey = timeRange === 'Tuần này' ? 'weekly' : 'monthly';

  // Tìm data. Nếu tuyến (routeKey) không có data, trả về của 'all'
  const data = analyticsDatabase[routeKey] || analyticsDatabase['all'];

  // Tìm data theo thời gian. Nếu không có, trả về 'weekly'
  return data[timeKey] || data['weekly'];
};