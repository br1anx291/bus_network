// src/pages/DriverManagementPage/DriverManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA TÀI XẾ
import DriverTable from '~/features/drivers/components/DriverTable/DriverTable';
import DriverFormModal from '~/features/drivers/components/DriverFormModal/DriverFormModal';
    
// 2. Import Service CỦA TÀI XẾ
import { driverService } from '~/services/driverService';

import styles from './DriverManagementPage.module.css';

const { Title } = Typography;

const DriverManagementPage = () => {
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
      const result = await driverService.getAll(page, pageSize);
      
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
      message.error('Lỗi khi tải danh sách tài xế!');
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
      await driverService.delete(id); 
      message.success('Xóa tài xế thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa tài xế!');
    }
  };

  // --- 5. SỬA STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingDriver(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (driver) => { 
    setEditingDriver(driver); 
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
          Quản lý tài xế 
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm tài xế mới 
        </Button>
      </Flex>

      {/* --- BẢNG DỮ LIỆU --- */}
      <DriverTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL --- */}
      <DriverFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingDriver={editingDriver} 
      />
    </div>
  );
};

export default DriverManagementPage;