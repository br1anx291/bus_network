// src/features/stations/components/StationTable/StationTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { STATUS_COLOR_MAP } from '../../data/stationMockData';
import styles from './StationTable.module.css';

const StationTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  // --- SỬA CỘT (COLUMNS) ---
  const columns = useMemo(
    () => [
      { title: 'TÊN TRẠM', dataIndex: 'name', key: 'name', width: '25%' },
      { 
        title: 'VĨ ĐỘ (LAT)', 
        dataIndex: 'lat', 
        key: 'lat',
        render: (lat) => lat.toFixed(4) // Làm tròn cho đẹp
      },
      { 
        title: 'KINH ĐỘ (LON)', 
        dataIndex: 'lon', 
        key: 'lon',
        render: (lon) => lon.toFixed(4) // Làm tròn cho đẹp
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
      className={styles.stationTable}
    />
  );
};

export default StationTable;