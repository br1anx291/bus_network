// src/features/drivers/data/driverMockData.js

// Dữ liệu thô
export const rawDriverData = [
  { id: 'd1', name: 'Nguyễn Văn A', email: 'vana@bus.com', licenseNumber: 'A1-12345', phone: '0905111222', status: 'Đang làm việc' }, // <-- THÊM VÀO
  { id: 'd2', name: 'Trần Thị B', email: 'thib@bus.com', licenseNumber: 'A1-67890', phone: '0905333444', status: 'Đang làm việc' }, // <-- THÊM VÀO
  { id: 'd3', name: 'Lê Văn C', email: 'vanc@bus.com', licenseNumber: 'A1-55566', phone: '0905777888', status: 'Tạm nghỉ' }, // <-- THÊM VÀO
  { id: 'd4', name: 'Phạm Hữu D', email: 'huud@bus.com', licenseNumber: 'A1-11223', phone: '0905999000', status: 'Đang làm việc' }, // <-- THÊM VÀO
];

// (Map màu không đổi)
export const STATUS_COLOR_MAP = {
  'Đang làm việc': 'success',
  'Tạm nghỉ': 'error',
};