import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Avatar, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, PhoneOutlined, IdcardOutlined, MailOutlined } from '@ant-design/icons';
import styles from './DriverTable.module.css'; 

const STATUS_MAP = {
  'active': { text: 'ĐANG LÀM VIỆC', color: 'green' },
  'off': { text: 'NGHỈ CA', color: 'orange' }, 
  'leave': { text: 'NGHỈ PHÉP', color: 'volcano' }, 
  'default': { text: 'KHÔNG RÕ', color: 'default' }
};

const DriverTable = ({ 
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
        title: 'TÀI XẾ', 
        key: 'info',
        width: 250,
        render: (_, record) => (
          <Space>
            <Avatar src={record.avatar} icon={<UserOutlined />} />
            <div>
              <div style={{ fontWeight: 600 }}>{record.name}</div>
              <div style={{ fontSize: 11, color: '#888' }}>
                <IdcardOutlined style={{ marginRight: 4 }} />
                {record.licenseNumber || 'Chưa cập nhật'}
              </div>
            </div>
          </Space>
        )
      },

      { 
        title: 'LIÊN HỆ', 
        dataIndex: 'phone', 
        key: 'phone',
        width: 150,
        render: (phone) => (
          phone ? (
            <span>
              <PhoneOutlined style={{ marginRight: 5, color: '#1890ff' }} />
              {phone}
            </span>
          ) : <span style={{ color: '#ccc' }}>--</span>
        )
      },

      { 
        title: 'EMAIL', 
        dataIndex: 'email', 
        key: 'email',
        width: 200,
        render: (email) => (
          email ? (
            <span>
              <MailOutlined style={{ marginRight: 5, color: '#1890ff' }} />
              {email}
            </span>
          ) : <span style={{ color: '#ccc' }}>--</span>
        )
      },

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
            
            <Tooltip title="Xóa tài xế">
              <Popconfirm
                title="Bạn chắc chắn muốn xóa tài xế này?"
                description="Hành động này không thể hoàn tác."
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
      rowKey="id"
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} kết quả`,
      }}
      onChange={onTableChange}
      className={styles.driverTable}
    />
  );
};

export default DriverTable;