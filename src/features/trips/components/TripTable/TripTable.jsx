// src/features/trips/components/TripTable/TripTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { STATUS_COLOR_MAP } from '../../data/tripMockData'; 
import styles from './TripTable.module.css';

const TripTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  const columns = useMemo(
    () => [
      { title: 'TÀI XẾ', dataIndex: 'driverName', key: 'driverName' },
      { title: 'BIỂN SỐ XE', dataIndex: 'vehiclePlate', key: 'vehiclePlate' },
      { title: 'TUYẾN', dataIndex: 'routeName', key: 'routeName' },
      { 
        title: 'BẮT ĐẦU', 
        dataIndex: 'startTime', 
        key: 'startTime',
      },
      { 
        title: 'KẾT THÚC (DỰ KIẾN)', 
        dataIndex: 'endTime', 
        key: 'endTime',
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
              // --- DÒNG ĐÃ SỬA LỖI ---
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
      className={styles.tripTable}
    />
  );
};

export default TripTable;