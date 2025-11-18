// src/features/routes/data/routeMockData.js

// Dữ liệu thô - Giả lập database (MASTER VERSION - DA NANG)
export const rawRouteData = [
  {
    id: 'r1',
    name: 'Tuyến 01',
    startPoint: 'Bến xe Trung tâm',
    endPoint: 'Hội An',
    numStops: 24,
    status: 'Đang hoạt động',
    description: 'BX Trung Tâm - Cầu Rồng - Ngũ Hành Sơn - Hội An',
    // --- Dữ liệu vẽ đường (GeoJSON LineString: [Longitude, Latitude]) ---
    // Nối: BX Trung Tâm -> Sân Bay -> Cầu Rồng -> Mỹ Khê -> Ngũ Hành Sơn
    coordinates: [
      [108.171621, 16.054028], // BX Trung Tâm (s1)
      [108.199431, 16.043906], // Sân Bay (s7)
      [108.219774, 16.060653], // Cầu Rồng (s2)
      [108.245863, 16.064633], // Biển Mỹ Khê (s4)
      [108.263344, 16.006458]  // Ngũ Hành Sơn (s5)
    ]
  },
  {
    id: 'r2',
    name: 'Tuyến 05',
    startPoint: 'Nguyễn Tất Thành',
    endPoint: 'Xuân Diệu',
    numStops: 18,
    status: 'Đang hoạt động',
    description: 'Chạy dọc đường biển Nguyễn Tất Thành qua Chợ Hàn',
    // Nối: ĐH Bách Khoa -> BX Trung Tâm -> Chợ Hàn -> Cầu Rồng -> Sân Bay
    coordinates: [
      [108.153226, 16.075631], // ĐH Bách Khoa (s6)
      [108.171621, 16.054028], // BX Trung Tâm (s1)
      [108.223848, 16.068526], // Chợ Hàn (s3)
      [108.219774, 16.060653], // Cầu Rồng (s2) - Điểm giao nhau
      [108.199431, 16.043906]  // Sân Bay (s7)
    ]
  },
  {
    id: 'r3',
    name: 'Tuyến R16',
    startPoint: 'Kim Liên',
    endPoint: 'Cao Đẳng Việt Hàn',
    numStops: 30,
    status: 'Bảo trì',
    description: 'Tuyến phục vụ sinh viên làng đại học Nam Đà Nẵng',
    coordinates: [] // Tuyến đang bảo trì nên chưa có lộ trình vẽ
  }
];

// Định nghĩa màu cho các Tag Trạng thái
export const STATUS_COLOR_MAP = {
  'Đang hoạt động': 'success',
  'Tạm ngưng': 'error',
  'Bảo trì': 'warning',
};