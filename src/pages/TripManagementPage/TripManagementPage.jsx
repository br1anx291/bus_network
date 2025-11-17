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

const TripManagementPage = () => {
  // --- STATE ---
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
      // [NÂNG CẤP 1] GỌI HÀM getAll
      const result = await tripService.getAll(page, pageSize);
      
      // Xử lý an toàn cho data trả về (Mock object hoặc API array)
      const list = result.data || result || [];
      const totalCount = result.total || list.length || 0;

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách chuyến!');
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
      // [NÂNG CẤP 2] GỌI HÀM delete
      await tripService.delete(id); 
      message.success('Xóa chuyến thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa chuyến!'); 
    }
  };

  // --- 5. STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingTrip(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => { 
    setEditingTrip(trip); 
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
          Quản lý chuyến 
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm chuyến mới 
        </Button>
      </Flex>

      {/* --- BẢNG DỮ LIỆU --- */}
      <TripTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL --- */}
      <TripFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingTrip={editingTrip} 
      />
    </div>
  );
};

export default TripManagementPage;