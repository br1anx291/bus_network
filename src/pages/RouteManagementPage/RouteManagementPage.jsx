// src/pages/RouteManagementPage/RouteManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA TUYẾN
import RouteTable from '~/features/routes/components/RouteTable';
import RouteFormModal from '~/features/routes/components/RouteFormModal';

// 2. Import Service CỦA TUYẾN
import { routeService } from '~/services/routeService';

import styles from './RouteManagementPage.module.css';

const { Title } = Typography;

// 3. Đổi tên Component
const RouteManagementPage = () => {
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
      // GỌI HÀM getRoutes
      const result = await routeService.getRoutes(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách tuyến!'); // Sửa text
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
      // GỌI HÀM deleteRoute
      await routeService.deleteRoute(id); 
      message.success('Xóa tuyến thành công!'); // Sửa text
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa tuyến!'); // Sửa text
    }
  };

  // --- 5. SỬA STATE MODAL (cho dễ đọc) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null); // Đổi tên state

  const handleOpenAddModal = () => {
    setEditingRoute(null); // Đổi tên state
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (route) => { // Đổi tên param
    setEditingRoute(route); // Đổi tên state
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
          Quản lý tuyến {/* Sửa text */}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm tuyến mới {/* Sửa text */}
        </Button>
      </Flex>

      {/* --- 6. SỬA COMPONENT CON --- */}
      <RouteTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <RouteFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingRoute={editingRoute} // Truyền prop mới
      />
    </div>
  );
};

export default RouteManagementPage;