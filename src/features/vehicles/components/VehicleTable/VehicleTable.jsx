import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm,Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './VehicleTable.module.css';

const STATUS_MAP = {
  'active': { text: 'ĐANG CHẠY', color: 'green' },
  'maintenance': { text: 'BẢO TRÌ', color: 'orange' },
  'stopped': { text: 'NGỪNG', color: 'red' },
  'default': { text: 'KHÔNG RÕ', color: 'default' }
};

const VehicleTable = ({ 
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
        title: 'BIỂN SỐ XE', 
        dataIndex: 'plate', 
        key: 'plate',
        render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
      },

      {
        title: 'THÔNG TIN XE',
        key: 'info',
        render: (_, record) => (
          <div>
            <div style={{ fontWeight: 500 }}>{record.model}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.capacity} chỗ ngồi</div>
          </div>
        )
      },

      { 
        title: 'TÀI XẾ', 
        dataIndex: 'driverName', 
        key: 'driverName',
        render: (text) => (
          <span style={{ color: text === 'Chưa phân công' ? '#ccc' : 'inherit' }}>
            {text}
          </span>
        )
      },

      { 
        title: 'ĐANG Ở TUYẾN', 
        dataIndex: 'routeName', 
        key: 'routeName',
        render: (text) => (
          text !== 'Chưa phân tuyến' 
            ? <Tag color="blue">{text}</Tag>
            : <span style={{ color: '#ccc' }}>--</span>
        )
      },

      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
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
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Sửa thông tin">
                <Button 
                  type="primary" ghost
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(record)}
                />
            </Tooltip>

            <Tooltip title="Xóa xe">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa xe này?"
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
      className={styles.vehicleTable}
    />
  );
};

export default VehicleTable;