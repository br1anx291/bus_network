// src/features/routes/data/routeMockData.js

// Dữ liệu thô - Giả lập database
export const rawRouteData = [
  {
    id: 'r1',
    name: 'Tuyến 01',
    startPoint: 'Bến Thành',
    endPoint: 'Bến xe Miền Tây',
    numStops: 4,
    status: 'Đang hoạt động',
    description: 'Bến Thành - Đầm Sen',
    // --- THÊM MỚI ---
    // (Đây là dữ liệu GeoJSON LineString)
    description: 'Bến Thành - Bến xe Miền Tây',
    coordinates: [
      [106.6980, 10.7725], // Bến Thành (s1)
      [106.6601, 10.7513], // Chợ Lớn (s3)
      [106.6210, 10.7380]  // Bến xe Miền Tây (s4)
    ]
  },
  {
    id: 'r2',
    name: 'Tuyến 05',
    startPoint: 'Bến Thành',
    endPoint: 'Đầm Sen',
    numStops: 3,
    status: 'Đang hoạt động',
    description: 'Bến Thành - Đầm Sen',
    // --- THÊM MỚI ---
    coordinates: [
      [106.6980, 10.7725], // Bến Thành (s1)
      [106.6575, 10.7751], // ĐH Bách Khoa (s2)
      [106.6416, 10.7675]  // Đầm Sen (s5)
    ]
  },
  // (Bạn có thể thêm các tuyến khác nếu muốn)
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Đang hoạt động': 'success',
  'Tạm ngưng': 'error',
};