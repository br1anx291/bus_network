// src/pages/PassengerManagementPage/PassengerManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA hành khách
import PassengerTable from '~/features/passengers/components/PassengerTable/PassengerTable';
import PassengerFormModal from '~/features/passengers/components/PassengerFormModal/PassengerFormModal';
    
// 2. Import Service CỦA hành khách
import { passengerService } from '~/services/passengerService';

import styles from './PassengerManagementPage.module.css';

const { Title } = Typography;

// 3. Đổi tên Component
const PassengerManagementPage = () => {
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
      // GỌI HÀM getPassengers
      const result = await passengerService.getPassengers(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách hành khách!'); // Sửa text
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
      // GỌI HÀM deletePassenger
      await passengerService.deletePassenger(id); 
      message.success('Xóa hành khách thành công!'); // Sửa text
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa hành khách!'); // Sửa text
    }
  };

  // --- 5. SỬA STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null); // Đổi tên state

  const handleOpenAddModal = () => {
    setEditingPassenger(null); // Đổi tên state
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (passenger) => { // Đổi tên param
    setEditingPassenger(passenger); // Đổi tên state
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
          Quản lý hành khách {/* Sửa text */}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm hành khách mới {/* Sửa text */}
        </Button>
      </Flex>

      {/* --- 6. SỬA COMPONENT CON --- */}
      <PassengerTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <PassengerFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingPassenger={editingPassenger} // Truyền prop mới
      />
    </div>
  );
};

export default PassengerManagementPage;