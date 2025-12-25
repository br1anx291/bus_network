import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm,Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import styles from './TripTable.module.css';

const STATUS_MAP = {
  'scheduled': { text: 'LÊN LỊCH', color: 'processing' },
  'running':   { text: 'ĐANG CHẠY', color: 'success' }, 
  'completed': { text: 'HOÀN THÀNH', color: 'default' }, 
  'cancelled': { text: 'ĐÃ HỦY', color: 'error' },    
};

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
      { 
        title: 'TUYẾN', 
        dataIndex: 'routeName', 
        key: 'routeName',
        render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
      },

      { 
        title: 'XE BUÝT', 
        dataIndex: 'busName', 
        key: 'busName',
        render: (text) => text || <span style={{ color: '#999' }}>Chưa gán</span>
      },

      { 
        title: 'BẮT ĐẦU', 
        dataIndex: 'startTime', 
        key: 'startTime',
        width: 180,
        render: (date) => date ? dayjs(date).format('HH:mm DD/MM/YYYY') : '--',
        sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
      },

      { 
        title: 'KẾT THÚC (DỰ KIẾN)', 
        dataIndex: 'endTime', 
        key: 'endTime',
        width: 180,
        render: (date) => date ? dayjs(date).format('HH:mm DD/MM/YYYY') : '--',
      },

      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (status) => {
          const config = STATUS_MAP[status] || { text: status, color: 'default' };
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

            <Tooltip title="Xóa chuyến">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa chuyến này?"
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
      className={styles.tripTable}
    />
  );
};

export default TripTable;