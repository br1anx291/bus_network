// src/features/vehicles/components/VehicleTable/VehicleTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { STATUS_COLOR_MAP } from '../../data/routeMockData';
import styles from './RouteTable.module.css';

const RouteTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  // 2. Thay đổi CỘT (columns)
  const columns = useMemo(
    () => [
      // { title: 'MÃ TUYẾN', dataIndex: 'code', key: 'code' },
      { title: 'TÊN TUYẾN', dataIndex: 'name', key: 'name' },
      {
        title: 'MÔ TẢ',
        dataIndex: 'description', // <-- Sửa 2: Thêm cột Mô tả
        key: 'description',
      },
      { 
        title: 'SỐ TRẠM DỪNG', 
        dataIndex: 'numStops', 
        key: 'numStops',
        align: 'center', // (Cho đẹp)
      },
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
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              style={{ color: '#1890ff' }} 
              onClick={() => onEdit(record)}
            />
            <Popconfirm
              title="Bạn chắc chắn muốn xóa?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [STATUS_COLOR_MAP, onEdit, onDelete]
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
      className={styles.routeTable} // 3. Đổi tên class
    />
  );
};

export default RouteTable;