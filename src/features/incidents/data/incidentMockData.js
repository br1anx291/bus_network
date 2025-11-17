// src/features/incidents/data/incidentMockData.js

// Dữ liệu thô - Đã thay "type" bằng "category"
export const rawIncidentData = [
  { id: 'i1', category: 'Thiết bị', detail: 'Xe 50H-12345 báo hỏng phanh', related: '50H-12345', time: '10:30 AM 25/10/2025', status: 'Mới', isCompleted: false },
  { id: 'i2', category: 'Thiết bị', detail: 'Mất tín hiệu GPS xe 29A-98765', related: '29A-98765', time: '10:35 AM 25/10/2025', status: 'Mới', isCompleted: false },
  { id: 'i3', category: 'Nhân sự', detail: 'Tài xế Nguyễn Văn A báo ốm', related: 'Nguyễn Văn A', time: '11:00 AM 25/10/2025', status: 'Đang chờ xử lý', isCompleted: false },
  { id: 'i4', category: 'Thiết bị', detail: 'Xe 51B-45678 báo hết xăng', related: '51B-45678', time: '11:15 AM 25/10/2025', status: 'Mới', isCompleted: false },
  { id: 'i5', category: 'Nhân sự', detail: 'Tài xế Trần Thị B báo nghỉ phép', related: 'Trần Thị B', time: '11:30 AM 25/10/2025', status: 'Đã xử lý', isCompleted: true },
];

// (MAP Trạng thái không đổi)
export const STATUS_COLOR_MAP = {
  'Mới': 'error',
  'Đang chờ xử lý': 'processing',
  'Đã xử lý': 'default', // Cập nhật từ 'N/A'
};

// Xóa TYPE_COLOR_MAP, thay bằng CATEGORY_COLOR_MAP
export const CATEGORY_COLOR_MAP = {
  'Thiết bị': 'red',
  'Nhân sự': 'blue',
  'Vận hành': 'orange',
};