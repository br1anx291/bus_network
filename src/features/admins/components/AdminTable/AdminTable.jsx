import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PhoneOutlined } from '@ant-design/icons';
import styles from './AdminTable.module.css';

const ROLE_CONFIG = {
  'superadmin': { text: 'Quản trị viên', color: 'volcano' },
  'manager':    { text: 'Quản lý',       color: 'geekblue' },
  'staff':      { text: 'Nhân viên',     color: 'green' },
  'default':    { text: 'Khác',          color: 'default' }
};

const STATUS_CONFIG = {
  'active':  { text: 'Đã xác thực',   color: 'success' }, 
  'pending': { text: 'Chưa xác thực', color: 'warning' }, 
  'default': { text: 'Không rõ',      color: 'default' }
};

const AdminTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete 
}) => {

  const columns = useMemo(
    () => [
      { 
        title: 'TÊN ADMIN', 
        dataIndex: 'username', 
        key: 'username',
        render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
      },
      
      { 
        title: 'EMAIL', 
        dataIndex: 'email', 
        key: 'email' 
      },

      {
        title: 'SỐ ĐIỆN THOẠI',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render: (phone) => phone ? (
          <Space>
             <PhoneOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
             {phone}
          </Space>
        ) : <span style={{ color: '#ccc' }}>---</span>
      },

      {
        title: 'VAI TRÒ',
        dataIndex: 'role',
        key: 'role',
        render: (role) => {
          const config = ROLE_CONFIG[role] || ROLE_CONFIG['default'];
          return <Tag color={config.color}>{config.text}</Tag>;
        },
      },

      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const config = STATUS_CONFIG[status] || STATUS_CONFIG['default'];
          return <Tag color={config.color}>{config.text}</Tag>;
        },
      },

      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        witdh: 120,
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Sửa thông tin">
              <Button 
                type="primary" ghost
                icon={<EditOutlined />} 
                onClick={() => onEdit(record)} 
              />
            </Tooltip>

            <Tooltip title="Xóa Admin">
              <Popconfirm
                title="Xóa người dùng này?"
                description="Hành động này không thể hoàn tác!"
                onConfirm={() => onDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
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
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.adminTable}
      rowKey="id"
    />
  );
};

export default AdminTable;