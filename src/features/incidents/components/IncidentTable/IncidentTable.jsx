// src/features/incidents/components/IncidentTable/IncidentTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip, Typography } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CarOutlined, 
  UserOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

import styles from './IncidentTable.module.css';

const { Text } = Typography;

// --- 1. ĐỊNH NGHĨA MAPPING (CONSTANTS) ---
// Không dùng import từ Mock Data nữa, định nghĩa cứng tại đây để độc lập

const CATEGORY_MAP = {
  'technical': { text: 'Kỹ thuật / Xe', color: 'blue' },
  'personnel': { text: 'Nhân sự',       color: 'purple' },
  'traffic':   { text: 'Giao thông',    color: 'orange' },
  'other':     { text: 'Khác',          color: 'default' },
};

const SEVERITY_MAP = {
  'low':    { text: 'Thấp',      color: 'success' },    // Xanh lá
  'medium': { text: 'Trung bình',color: 'warning' },    // Vàng
  'high':   { text: 'CAO',       color: 'error' },      // Đỏ (Nguy hiểm)
};

const STATUS_MAP = {
  'pending':    { text: 'Mới tiếp nhận', color: 'default' },
  'processing': { text: 'Đang xử lý',    color: 'processing' }, // Xanh dương
  'resolved':   { text: 'Đã giải quyết', color: 'success' },    // Xanh lá
};

const IncidentTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange,
  onEdit,    // Thay thế onView/onMarkComplete bằng onEdit
  onDelete 
}) => {

  const columns = useMemo(
    () => [
      // 1. Tiêu đề & Mô tả (Gộp chung cho gọn)
{ 
        title: 'SỰ CỐ', 
        key: 'info',
        // [QUAN TRỌNG] Đặt chiều rộng cố định cho cột này
        width: 300, 
        render: (_, record) => (
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '280px' }}>
            <Text strong style={{ fontSize: '14px', marginBottom: '4px' }}>
               {record.title}
            </Text>
            
            {/* Logic cắt dòng thông minh của Ant Design */}
            <Text 
              type="secondary" 
              style={{ fontSize: '12px' }} 
              ellipsis={{ 
                tooltip: record.description, // Hiện full khi rê chuột
                rows: 2 // Chỉ cho hiện tối đa 2 dòng
              }}
            >
              {record.description}
            </Text>
          </div>
        )
      },

      // 2. Phân loại
      { 
        title: 'PHÂN LOẠI', 
        dataIndex: 'category', 
        key: 'category',
        width: 120,
        render: (cat) => {
          const config = CATEGORY_MAP[cat] || CATEGORY_MAP['other'];
          return <Tag color={config.color}>{config.text}</Tag>;
        }
      },

      // 3. [MỚI] Mức độ nghiêm trọng
      {
        title: 'MỨC ĐỘ',
        dataIndex: 'severity',
        key: 'severity',
        align: 'center',
        width: 100,
        render: (level) => {
          const config = SEVERITY_MAP[level] || SEVERITY_MAP['low'];
          return (
            <Tag icon={level === 'high' ? <ExclamationCircleOutlined /> : null} color={config.color}>
              {config.text}
            </Tag>
          );
        }
      },

      // 4. Liên quan (Xe hoặc Tài xế)
      { 
        title: 'LIÊN QUAN', 
        key: 'related',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            {/* Nếu có liên kết xe */}
            {record.busId && (
              <Space>
                <CarOutlined style={{ color: '#1890ff' }} /> 
                <span style={{ fontWeight: 500 }}>{record.busPlate}</span>
              </Space>
            )}
            
            {/* Nếu có liên kết tài xế */}
            {record.driverId && (
              <Space>
                <UserOutlined style={{ color: '#52c41a' }} />
                <span>{record.driverName}</span>
              </Space>
            )}

            {/* Nếu không có gì */}
            {!record.busId && !record.driverId && <span style={{ color: '#ccc' }}>---</span>}
          </Space>
        )
      },

      // 5. Thời gian báo cáo
      { 
        title: 'THỜI GIAN', 
        dataIndex: 'createdAt', 
        key: 'createdAt',
        render: (date) => (
          <span style={{ fontSize: '13px', color: '#666' }}>
            {dayjs(date).format('HH:mm DD/MM/YYYY')}
          </span>
        )
      },

      // 6. Trạng thái
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const config = STATUS_MAP[status] || STATUS_MAP['pending'];
          return <Tag color={config.color}>{config.text}</Tag>;
        },
      },

      // 7. Hành động (Edit / Delete)
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        align: 'center',
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Cập nhật / Xử lý">
              <Button 
                type="primary" 
                ghost
                icon={<EditOutlined />} 
                size="small"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            
            <Tooltip title="Xóa sự cố">
               <Popconfirm
                  title="Xóa sự cố này?"
                  description="Hành động này không thể hoàn tác."
                  onConfirm={() => onDelete(record.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete] 
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.incidentTable}
      rowKey="id"
    />
  );
};

export default IncidentTable;