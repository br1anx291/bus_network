// src/features/vehicles/components/VehicleTable/VehicleTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { STATUS_COLOR_MAP } from '../../data/vehicleMockData';
import styles from './VehicleTable.module.css';

/**
 * Component "ngu" (dumb component)
 * Nhận toàn bộ data và handlers từ props
 */
const VehicleTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  // Định nghĩa cột (dùng useMemo)
  const columns = useMemo(
    () => [
      { title: 'BIỂN SỐ XE', dataIndex: 'plate', key: 'plate' },
      { title: 'SỨC CHỨA', dataIndex: 'capacity', key: 'capacity' },
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={STATUS_COLOR_MAP[status] || 'default'}>
            {status.toUpperCase()}
          </Tag>
        ),
      },
      { title: 'ĐANG Ở TUYẾN', dataIndex: 'routeName', key: 'routeName' },
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            {/* 1. Bóp cò 'onEdit' từ props */}
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              style={{ color: '#1890ff' }} 
              onClick={() => onEdit(record)} // <-- SỬA Ở ĐÂY
            />

            {/* 2. Bóp cò 'onDelete' từ props */}
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={() => onDelete(record.id)} // <-- SỬA Ở ĐÂY
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [STATUS_COLOR_MAP, onEdit, onDelete] // Phụ thuộc vào handlers
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
      onChange={onTableChange} // Gọi handler từ props
      className={styles.vehicleTable}
    />
  );
};

export default VehicleTable;