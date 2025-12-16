import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './PassengerTable.module.css';

// 1. TỪ ĐIỂN TRẠNG THÁI (Anh -> Việt)
// Giúp hiển thị tiếng Việt đẹp mắt thay vì raw data từ DB
const STATUS_MAP = {
  'active': { text: 'HOẠT ĐỘNG', color: 'green' },
  'blocked': { text: 'ĐÃ KHÓA', color: 'red' },
  'default': { text: 'KHÔNG RÕ', color: 'default' }
};

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
      // --- CỘT 1: TÊN HÀNH KHÁCH ---
      { 
        title: 'TÊN HÀNH KHÁCH', 
        dataIndex: 'name', 
        key: 'name',
        render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
      },

      // --- CỘT 2: EMAIL ---
      { 
        title: 'EMAIL', 
        dataIndex: 'email', 
        key: 'email',
        render: (email) => email || <span style={{ color: '#ccc' }}>--</span>
      },

      // --- CỘT 3: SỐ ĐIỆN THOẠI ---
      { 
        title: 'SỐ ĐIỆN THOẠI', 
        dataIndex: 'phone', 
        key: 'phone',
        render: (phone) => phone || <span style={{ color: '#ccc' }}>--</span>
      },

      // --- CỘT 4: TRẠNG THÁI (Dùng Map để dịch) ---
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
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
        align: 'center',
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Sửa thông tin">
                <Button 
                  type="primary" ghost
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(record)}
                />
            </Tooltip>

            <Tooltip title="Xóa hành khách">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa hành khách này?"
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
      rowKey="id"
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.passengerTable}
    />
  );
};

export default PassengerTable;