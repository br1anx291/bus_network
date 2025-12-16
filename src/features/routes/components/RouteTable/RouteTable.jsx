// src/features/routes/components/RouteTable/RouteTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CompassOutlined, UnorderedListOutlined } from '@ant-design/icons'; // Thêm icon Compass

import styles from './RouteTable.module.css';
  
// 1. TỪ ĐIỂN TRẠNG THÁI (Anh -> Việt)
const STATUS_MAP = {
  'active': { text: 'HOẠT ĐỘNG', color: 'green' },
  'maintenance': { text: 'BẢO TRÌ', color: 'orange' },
  'stopped': { text: 'NGỪNG', color: 'red' },
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
      // --- CỘT 1: MÃ TUYẾN (Đưa lên đầu) ---
      { 
        title: 'MÃ TUYẾN', 
        dataIndex: 'code', 
        key: 'code',
        width: 150,
        render: (text) => (
           text ? <Tag color="geekblue" style={{ fontWeight: 'bold' }}>{text}</Tag> : <span>--</span>
        )
      },

      // --- CỘT 2: TÊN TUYẾN ---
      { 
        title: 'TÊN TUYẾN', 
        dataIndex: 'name', 
        key: 'name',
        width: 200,
        render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
      },

      // --- CỘT 3: MÔ TẢ ---
      {
        title: 'MÔ TẢ LỘ TRÌNH',
        dataIndex: 'description', 
        key: 'description',
        ellipsis: true, // Tự động cắt ngắn nếu quá dài (...)
      },

      // --- CỘT 4: TRẠNG THÁI ---
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

      // --- CỘT 5: HÀNH ĐỘNG ---
      {
        title: 'HÀNH ĐỘNG',
        key: 'action',
        width: 180,
        render: (_, record) => (
          <Space size="small">
            {/* 1. Nút Sửa lộ trình (Vẽ bản đồ) - CHUẨN BỊ CHO TÍNH NĂNG TỚI */}
            <Tooltip title="Vẽ lộ trình trên bản đồ">
                <Button 
                  type="default"
                  icon={<CompassOutlined />} 
                  style={{ color: '#fa8c16', borderColor: '#fa8c16' }} // Màu cam
                  onClick={() => onEditMap && onEditMap(record)} // Gọi hàm mở Modal vẽ
                />
            </Tooltip>
            
            <Tooltip title="Gán trạm dừng">
                <Button 
                  type="default"
                  icon={<UnorderedListOutlined />} 
                  style={{ color: '#52c41a', borderColor: '#52c41a' }} // Màu xanh lá
                  onClick={() => onEditStations && onEditStations(record)} 
                />
            </Tooltip>

            {/* 2. Nút Sửa thông tin */}
            <Tooltip title="Sửa thông tin">
                <Button 
                  type="primary" ghost
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(record)}
                />
            </Tooltip>

            {/* 3. Nút Xóa */}
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