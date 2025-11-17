// src/features/passengers/data/passengerMockData.js

// Dữ liệu thô - Giả lập database
export const rawPassengerData = [
  { id: 'p1', name: 'Lý Thị M', email: 'lym@email.com', phone: '0901234567', status: 'Đang hoạt động' },
  { id: 'p2', name: 'Hoàng Văn K', email: 'vank@email.com', phone: '0907654321', status: 'Đang hoạt động' },
  { id: 'p3', name: 'Đỗ Thị N', email: 'thin@email.com', phone: '0908888999', status: 'Bị cấm' },
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Đang hoạt động': 'success',
  'Bị cấm': 'error',
};