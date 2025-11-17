// src/pages/TripManagementPage/TripManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA chuyến
import TripTable from '~/features/trips/components/TripTable/TripTable';
import TripFormModal from '~/features/trips/components/TripFormModal/TripFormModal';

// 2. Import Service CỦA chuyến
import { tripService } from '~/services/tripService';

import styles from './TripManagementPage.module.css';

const { Title } = Typography;

// 3. Đổi tên Component
const TripManagementPage = () => {
  // --- (State không đổi) ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  // --- 4. SỬA CÁC HÀM SERVICE ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // GỌI HÀM getTrips
      const result = await tripService.getTrips(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách chuyến!'); // Sửa text
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id) => {
    try {
      // GỌI HÀM deleteTrip
      await tripService.deleteTrip(id); 
      message.success('Xóa chuyến thành công!'); // Sửa text
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa chuyến!'); // Sửa text
    }
  };

  // --- 5. SỬA STATE MODAL (cho dễ đọc) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null); // Đổi tên state

  const handleOpenAddModal = () => {
    setEditingTrip(null); // Đổi tên state
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => { // Đổi tên param
    setEditingTrip(trip); // Đổi tên state
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    handleCloseModal();
    fetchData(); 
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER CỦA TRANG --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý chuyến {/* Sửa text */}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm chuyến mới {/* Sửa text */}
        </Button>
      </Flex>

      {/* --- 6. SỬA COMPONENT CON --- */}
      <TripTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <TripFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingTrip={editingTrip} // Truyền prop mới
      />
    </div>
  );
};

export default TripManagementPage;