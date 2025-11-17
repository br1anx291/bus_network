// src/features/trips/data/tripMockData.js

// Dữ liệu thô - Giả lập database
export const rawTripData = [
  { id: 't1', routeName: 'Tuyến 05', vehiclePlate: '50H-12345', driverName: 'Nguyễn Văn A', startTime: '2025-11-15T08:00:00', endTime: '2025-11-15T09:30:00', status: 'Đã hoàn thành' },
  { id: 't2', routeName: 'Tuyến 01', vehiclePlate: '29A-98765', driverName: 'Trần Thị B', startTime: '2025-11-15T09:30:00', endTime: '2025-11-15T11:00:00', status: 'Đang chạy' },
  { id: 't3', routeName: 'Tuyến 08', vehiclePlate: '51B-45678', driverName: 'Lê Văn C', startTime: '2025-11-15T14:00:00', endTime: '2025-11-15T15:45:00', status: 'Sắp chạy' },
  { id: 't4', routeName: 'Tuyến 12', vehiclePlate: '92K-00123', driverName: 'Phạm Hữu D', startTime: '2025-11-15T16:00:00', endTime: '2025-11-15T17:30:00', status: 'Bị hủy' },
  { id: 't5', routeName: 'Tuyến 05', vehiclePlate: '50H-12345', driverName: 'Nguyễn Văn A', startTime: '2025-11-15T18:00:00', endTime: '2025-11-15T19:30:00', status: 'Sắp chạy' },
];

// Định nghĩa màu cho các Tag Trạng thái (không đổi)
export const STATUS_COLOR_MAP = {
  'Đã hoàn thành': 'default',
  'Đang chạy': 'success',
  'Sắp chạy': 'processing',
  'Bị hủy': 'error',
};