// src/features/passengers/components/PassengerTable/PassengerTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { STATUS_COLOR_MAP } from '../../data/passengerMockData'; 
import styles from './PassengerTable.module.css';

const PassengerTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  const columns = useMemo(
    () => [
      { title: 'TÊN HÀNH KHÁCH', dataIndex: 'name', key: 'name' },
      { title: 'EMAIL', dataIndex: 'email', key: 'email' },
      { title: 'SỐ ĐIỆN THOẠI', dataIndex: 'phone', key: 'phone' },
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
      className={styles.passengerTable} // Sửa tên class
    />
  );
};

export default PassengerTable;