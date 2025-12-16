// src/features/stations/components/StationTable/StationTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './StationTable.module.css';

// 1. TỪ ĐIỂN TRẠNG THÁI (Anh -> Việt)
const STATUS_MAP = {
  'active': { text: 'HOẠT ĐỘNG', color: 'green' },
  'maintenance': { text: 'BẢO TRÌ', color: 'orange' },
  'stopped': { text: 'NGỪNG HOẠT ĐỘNG', color: 'red' }, // Trạm thường dùng 'inactive' thay vì 'stopped'
  'default': { text: 'KHÔNG RÕ', color: 'default' }
};

const StationTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  const columns = useMemo(
    () => [
      // --- CỘT 1: TÊN TRẠM ---
      { 
        title: 'TÊN TRẠM', 
        dataIndex: 'name', 
        key: 'name', 
        width: 200,
        render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
      },

      // --- CỘT 2: ĐỊA CHỈ (Mới) ---
      {
        title: 'ĐỊA CHỈ',
        dataIndex: 'address',
        key: 'address',
        render: (text) => (
          <span>
            <EnvironmentOutlined style={{ marginRight: 5, color: '#1890ff' }} />
            {text || <span style={{ color: '#ccc' }}>Chưa cập nhật</span>}
          </span>
        )
      },

      // --- CỘT 3: TOẠ ĐỘ (Gộp Lat/Lng cho gọn) ---
      { 
        title: 'TOẠ ĐỘ (Lat - Lng)', 
        key: 'coordinates',
        width: 180,
        render: (_, record) => (
          <span style={{ fontSize: 13, color: '#666', fontFamily: 'monospace' }}>
            {/* Làm tròn 5 số thập phân là đủ chuẩn GPS */}
            {Number(record.lat).toFixed(5)} , {Number(record.lng).toFixed(5)}
          </span>
        )
      },

      // --- CỘT 4: TRẠNG THÁI ---
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (status) => {
          const config = STATUS_MAP[status] || STATUS_MAP['default'];
          return (
            <Tag color={config.color}>
              {config.text}
            </Tag>
          );
        },
      },

      // --- CỘT 5: HÀNH ĐỘNG ---
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        width: 120,
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Sửa thông tin">
                <Button 
                  type="primary" ghost
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(record)}
                />
            </Tooltip>

            {/* 3. Nút Xóa */}
            <Tooltip title="Xóa trạm">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa trạm này?"
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
      rowKey="id" // Quan trọng
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.stationTable}
    />
  );
};

export default StationTable;