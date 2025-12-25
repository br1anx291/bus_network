import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Avatar, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; 

import styles from './PickupRequestTable.module.css';

const STATUS_MAP = {
  'pending':   { text: 'CHỜ DUYỆT', color: 'orange' },
  'accepted':  { text: 'ĐÃ DUYỆT',  color: 'green' },
  'rejected':  { text: 'TỪ CHỐI',   color: 'red' },
  'completed': { text: 'HOÀN THÀNH', color: 'blue' },
};

const PickupRequestTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onApprove, 
  onDeny ,
  onCancel
}) => {

  const columns = useMemo(
    () => [
      { 
        title: 'HÀNH KHÁCH', 
        key: 'userInfo',
        width: 250,
        render: (_, record) => (
          <Space>
            <Avatar src={record.userAvatar} icon={<UserOutlined />} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>{record.userName}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>{record.userPhone}</span>
            </div>
          </Space>
        )
      },

      { 
        title: 'ĐIỂM ĐÓN', 
        dataIndex: 'stationName', 
        key: 'stationName',
        render: (text, record) => (
          <Tooltip title={record.stationAddress}>
            <span>{text}</span>
          </Tooltip>
        )
      },

      { 
        title: 'CHUYẾN (GIỜ ĐI)', 
        key: 'tripInfo',
        width: 200,
        render: (_, record) => {
          if (!record.tripStartTime) return <span style={{color: '#999'}}>Chưa xác định</span>;
          return (
            <Space>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
              {dayjs(record.tripStartTime).format('HH:mm DD/MM/YYYY')}
            </Space>
          );
        }
      },

      {
        title: 'XE ĐÓN',
        dataIndex: 'busPlate',
        key: 'busPlate',
        render: (text) => text ? <Tag color="geekblue">{text}</Tag> : <span style={{color: '#ccc'}}>-</span>
      },

      { 
        title: 'GỬI LÚC', 
        dataIndex: 'createdAt', 
        key: 'createdAt',
        width: 150,
        render: (date) => <span style={{ fontSize: '13px', color: '#666' }}>{dayjs(date).format('HH:mm DD/MM')}</span>,
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },

      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 120,
        render: (status) => {
          const config = STATUS_MAP[status] || { text: status, color: 'default' };
          return <Tag color={config.color}>{config.text}</Tag>;
        },
      },

      {
        title: 'XỬ LÝ',
        key: 'action',
        align: 'center',
        width: 140, 
        render: (_, record) => {
          
          if (record.status === 'pending') {
            return (
              <Space size="small">
                <Tooltip title="Duyệt yêu cầu">
                  <Button 
                    type="primary" 
                    shape="circle"
                    icon={<CheckOutlined />} 
                    size="small"
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    onClick={() => onApprove(record.id)} 
                  />
                </Tooltip>
                
                <Tooltip title="Từ chối">
                  <Popconfirm
                    title="Từ chối yêu cầu này?"
                    description="Hành động này sẽ hủy yêu cầu đón."
                    onConfirm={() => onDeny(record.id)}
                    okText="Từ chối"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button 
                      type="primary" 
                      danger 
                      shape="circle"
                      icon={<CloseOutlined />}
                      size="small" 
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            );
          }

          if (record.status === 'accepted') {
            return (
              <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#faad14', fontStyle: 'italic' }}>
                  Đang chờ xe
                </span>
                
                {onCancel && (
                  <Tooltip title="Khách báo hủy chuyến này">
                    <Popconfirm
                      title="Hủy chuyến đã duyệt?"
                      description="Hành động này sẽ hủy chuyến đi đang chờ."
                      onConfirm={() => onCancel(record.id)} 
                      cancelText="Không"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        size="small" 
                        danger 
                        type="dashed"
                        style={{ fontSize: '12px' }}
                      >
                        Hủy
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                )}
              </Space>
            );
          }

          return <span style={{ color: '#d9d9d9' }}>-</span>;
        },
      },
    ],
    [onApprove, onDeny, onCancel]
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        ...pagination,
        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total}`,
      }}
      onChange={onTableChange}
      className={styles.pickupRequestTable}
    />
  );
};

export default PickupRequestTable;