// src/features/trips/components/TripTable/TripTable.jsx
import React, { useMemo } from 'react';
import { Table, Tag, Space, Button, Popconfirm,Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Cần đảm bảo project đã cài: npm install dayjs

import styles from './TripTable.module.css';

// TỪ ĐIỂN TRẠNG THÁI (Màu sắc & Tiếng Việt)
const STATUS_MAP = {
  'scheduled': { text: 'LÊN LỊCH', color: 'processing' }, // xanh dương nhạt
  'running':   { text: 'ĐANG CHẠY', color: 'success' },    // xanh lá
  'completed': { text: 'HOÀN THÀNH', color: 'default' },   // xám
  'cancelled': { text: 'ĐÃ HỦY', color: 'error' },         // đỏ
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
      // --- CỘT 1: TUYẾN ĐƯỜNG ---
      { 
        title: 'TUYẾN', 
        dataIndex: 'routeName', 
        key: 'routeName',
        render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
      },

      // --- CỘT 2: XE THỰC HIỆN ---
      { 
        title: 'XE BUÝT', 
        dataIndex: 'busName', 
        key: 'busName',
        render: (text) => text || <span style={{ color: '#999' }}>Chưa gán</span>
      },

      // --- CỘT 3: THỜI GIAN ĐI (Có sắp xếp) ---
      { 
        title: 'BẮT ĐẦU', 
        dataIndex: 'startTime', 
        key: 'startTime',
        width: 180,
        render: (date) => date ? dayjs(date).format('HH:mm DD/MM/YYYY') : '--',
        sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
      },

      // --- CỘT 4: THỜI GIAN ĐẾN ---
      { 
        title: 'KẾT THÚC (DỰ KIẾN)', 
        dataIndex: 'endTime', 
        key: 'endTime',
        width: 180,
        render: (date) => date ? dayjs(date).format('HH:mm DD/MM/YYYY') : '--',
      },

      // --- CỘT 5: TRẠNG THÁI ---
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

      // --- CỘT 6: HÀNH ĐỘNG ---
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

            {/* 3. Nút Xóa */}
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
      rowKey="id" // Quan trọng: Giúp React định danh từng dòng
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