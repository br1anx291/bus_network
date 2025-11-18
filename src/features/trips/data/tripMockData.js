// src/features/trips/data/tripMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION - DA NANG)
export const rawTripData = [
  { 
    id: 't1', 
    routeName: 'Tuyến 01', 
    vehiclePlate: '43B-012.34', 
    driverName: 'Nguyễn Văn A', 
    startTime: '2025-11-18T08:00:00', 
    endTime: '2025-11-18T09:30:00', 
    status: 'Đã hoàn thành' 
  },
  { 
    id: 't2', 
    routeName: 'Tuyến 05', 
    vehiclePlate: '43B-056.78', 
    driverName: 'Trần Thị B', 
    startTime: '2025-11-18T09:30:00', 
    endTime: '2025-11-18T11:00:00', 
    status: 'Đang chạy' 
  },
  { 
    id: 't3', 
    routeName: 'Tuyến R16', 
    vehiclePlate: '43B-099.99', 
    driverName: 'Lê Văn C', 
    startTime: '2025-11-18T14:00:00', 
    endTime: '2025-11-18T15:45:00', 
    status: 'Sắp chạy' 
  },
  { 
    id: 't4', 
    routeName: 'Tuyến 01', 
    vehiclePlate: '92K-001.23', 
    driverName: 'Phạm Hữu D', 
    startTime: '2025-11-18T16:00:00', 
    endTime: '2025-11-18T17:30:00', 
    status: 'Bị hủy' 
  },
  { 
    id: 't5', 
    routeName: 'Tuyến 01', 
    vehiclePlate: '43B-012.34', 
    driverName: 'Nguyễn Văn A', 
    startTime: '2025-11-18T18:00:00', 
    endTime: '2025-11-18T19:30:00', 
    status: 'Sắp chạy' 
  },
];

// Định nghĩa màu cho các Tag Trạng thái (không đổi)
export const STATUS_COLOR_MAP = {
  'Đã hoàn thành': 'default',
  'Đang chạy': 'success',
  'Sắp chạy': 'processing',
  'Bị hủy': 'error',
};