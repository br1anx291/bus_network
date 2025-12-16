// src/features/vehicles/components/VehicleTable/VehicleTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm,Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './VehicleTable.module.css';

// 1. TỪ ĐIỂN TRẠNG THÁI (Map từ Anh -> Việt)
const STATUS_MAP = {
  'active': { text: 'ĐANG CHẠY', color: 'green' },
  'maintenance': { text: 'BẢO TRÌ', color: 'orange' },
  'stopped': { text: 'NGỪNG', color: 'red' },
  'default': { text: 'KHÔNG RÕ', color: 'default' }
};

const VehicleTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  // Định nghĩa cột
  const columns = useMemo(
    () => [
      // --- CỘT 1: BIỂN SỐ ---
      { 
        title: 'BIỂN SỐ XE', 
        dataIndex: 'plate', 
        key: 'plate',
        render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
      },

      // --- CỘT 2: THÔNG TIN XE (Gộp Model + Capacity) ---
      {
        title: 'THÔNG TIN XE',
        key: 'info',
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 500 }}>{record.model}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.capacity} chỗ ngồi</div>
          </div>
        )
      },

      // --- CỘT 3: TÀI XẾ ---
      { 
        title: 'TÀI XẾ', 
        dataIndex: 'driverName', 
        key: 'driverName',
        render: (text) => (
          <span style={{ color: text === 'Chưa phân công' ? '#ccc' : 'inherit' }}>
            {text}
          </span>
        )
      },

      // --- CỘT 4: TUYẾN ĐANG CHẠY ---
      { 
        title: 'ĐANG Ở TUYẾN', 
        dataIndex: 'routeName', 
        key: 'routeName',
        render: (text) => (
          text !== 'Chưa phân tuyến' 
            ? <Tag color="blue">{text}</Tag> // Nếu có tuyến -> Tag xanh
            : <span style={{ color: '#ccc' }}>--</span> // Không có -> Gạch ngang
        )
      },

      // --- CỘT 5: TRẠNG THÁI (Dùng STATUS_MAP) ---
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          // Lấy config màu và chữ, nếu không có thì lấy default
          const config = STATUS_MAP[status] || STATUS_MAP['default'];
          return (
            <Tag color={config.color}>
              {config.text}
            </Tag>
          );
        },
      },


      // --- CỘT 7: HÀNH ĐỘNG ---
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
             {/* 2. Nút Sửa thông tin */}
            <Tooltip title="Sửa thông tin">
                <Button 
                  type="primary" ghost
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(record)}
                />
            </Tooltip>

            {/* 3. Nút Xóa */}
            <Tooltip title="Xóa xe">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa xe này?"
                  description="Hành động này không thể hoàn tác."
                  onConfirm={() => onDelete(record.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
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
      rowKey="id" // Quan trọng để React không báo lỗi thiếu Key
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.vehicleTable}
    />
  );
};

export default VehicleTable;