import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip, Typography } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CarOutlined, 
  UserOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

import styles from './IncidentTable.module.css';

const { Text } = Typography;

const CATEGORY_MAP = {
  'technical': { text: 'Kỹ thuật / Xe', color: 'blue' },
  'personnel': { text: 'Nhân sự',       color: 'purple' },
  'traffic':   { text: 'Giao thông',    color: 'orange' },
  'other':     { text: 'Khác',          color: 'default' },
};

const SEVERITY_MAP = {
  'low':    { text: 'Thấp',      color: 'success' },    
  'medium': { text: 'Trung bình',color: 'warning' },    
  'high':   { text: 'CAO',       color: 'error' },      
};

const STATUS_MAP = {
  'pending':    { text: 'Mới tiếp nhận', color: 'default' },
  'processing': { text: 'Đang xử lý',    color: 'processing' }, 
  'resolved':   { text: 'Đã giải quyết', color: 'success' },    
};

const IncidentTable = ({ 
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
        title: 'SỰ CỐ', 
        key: 'info',
        width: 300, 
        render: (_, record) => (
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '280px' }}>
            <Text strong style={{ fontSize: '14px', marginBottom: '4px' }}>
               {record.title}
            </Text>
            
            <Text 
              type="secondary" 
              style={{ fontSize: '12px' }} 
              ellipsis={{ 
                tooltip: record.description,
                rows: 2 
              }}
            >
              {record.description}
            </Text>
          </div>
        )
      },

      { 
        title: 'PHÂN LOẠI', 
        dataIndex: 'category', 
        key: 'category',
        width: 120,
        render: (cat) => {
          const config = CATEGORY_MAP[cat] || CATEGORY_MAP['other'];
          return <Tag color={config.color}>{config.text}</Tag>;
        }
      },

      {
        title: 'MỨC ĐỘ',
        dataIndex: 'severity',
        key: 'severity',
        align: 'center',
        width: 100,
        render: (level) => {
          const config = SEVERITY_MAP[level] || SEVERITY_MAP['low'];
          return (
            <Tag icon={level === 'high' ? <ExclamationCircleOutlined /> : null} color={config.color}>
              {config.text}
            </Tag>
          );
        }
      },

      { 
        title: 'LIÊN QUAN', 
        key: 'related',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            {record.busId && (
              <Space>
                <CarOutlined style={{ color: '#1890ff' }} /> 
                <span style={{ fontWeight: 500 }}>{record.busPlate}</span>
              </Space>
            )}
            
            {record.driverId && (
              <Space>
                <UserOutlined style={{ color: '#52c41a' }} />
                <span>{record.driverName}</span>
              </Space>
            )}

            {!record.busId && !record.driverId && <span style={{ color: '#ccc' }}>---</span>}
          </Space>
        )
      },

      { 
        title: 'THỜI GIAN', 
        dataIndex: 'createdAt', 
        key: 'createdAt',
        render: (date) => (
          <span style={{ fontSize: '13px', color: '#666' }}>
            {dayjs(date).format('HH:mm DD/MM/YYYY')}
          </span>
        )
      },

      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const config = STATUS_MAP[status] || STATUS_MAP['pending'];
          return <Tag color={config.color}>{config.text}</Tag>;
        },
      },

      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        align: 'center',
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Cập nhật / Xử lý">
              <Button 
                type="primary" 
                ghost
                icon={<EditOutlined />} 
                size="small"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            
            <Tooltip title="Xóa sự cố">
               <Popconfirm
                  title="Xóa sự cố này?"
                  description="Hành động này không thể hoàn tác."
                  onConfirm={() => onDelete(record.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
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
      className={styles.incidentTable}
      rowKey="id"
    />
  );
};

export default IncidentTable;