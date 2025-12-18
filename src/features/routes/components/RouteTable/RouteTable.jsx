import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CompassOutlined, UnorderedListOutlined } from '@ant-design/icons'; 

import styles from './RouteTable.module.css';
  
const STATUS_MAP = {
  'active': { text: 'ĐANG HOẠT ĐỘNG', color: 'green' },
  'maintenance': { text: 'BẢO TRÌ', color: 'orange' },
  'stopped': { text: 'TẠM NGƯNG', color: 'red' },
  'default': { text: 'KHÔNG RÕ', color: 'default' }
};

const RouteTable = ({ 
  data, 
  loading, 
  pagination, 
  onTableChange, 
  onEdit, 
  onDelete,
  onEditMap,
  onEditStations 
}) => {

  const columns = useMemo(
    () => [
      { 
        title: 'MÃ TUYẾN', 
        dataIndex: 'code', 
        key: 'code',
        width: 150,
        render: (text) => (
           text ? <Tag color="geekblue" style={{ fontWeight: 'bold' }}>{text}</Tag> : <span>--</span>
        )
      },

      { 
        title: 'TÊN TUYẾN', 
        dataIndex: 'name', 
        key: 'name',
        width: 200,
        render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
      },

      {
        title: 'MÔ TẢ LỘ TRÌNH',
        dataIndex: 'description', 
        key: 'description',
        ellipsis: true,
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
        width: 180,
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="Vẽ lộ trình trên bản đồ">
                <Button 
                  type="default"
                  icon={<CompassOutlined />} 
                  style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
                  onClick={() => onEditMap && onEditMap(record)}
                />
            </Tooltip>
            
            <Tooltip title="Gán trạm dừng">
                <Button 
                  type="default"
                  icon={<UnorderedListOutlined />} 
                  style={{ color: '#52c41a', borderColor: '#52c41a' }}
                  onClick={() => onEditStations && onEditStations(record)} 
                />
            </Tooltip>

            <Tooltip title="Sửa thông tin">
                <Button 
                  type="primary" ghost
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(record)}
                />
            </Tooltip>

            <Tooltip title="Xóa tuyến">
                <Popconfirm
                  title="Bạn chắc chắn muốn xóa tuyến này?"
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
    [onEdit, onDelete, onEditMap, onEditStations]
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
      className={styles.routeTable}
    />
  );
};

export default RouteTable;