// src/pages/AdminManagementPage/AdminManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'; // Thêm icon reload cho chuyên nghiệp

// 1. Import Bảng và Modal
import AdminTable from '~/features/admins/components/AdminTable/AdminTable';
import AdminFormModal from '~/features/admins/components/AdminFormModal/AdminFormModal';
    
// 2. Import Service
import { adminService } from '~/services/adminService';

import styles from './AdminManagementPage.module.css';

const { Title } = Typography;

const AdminManagementPage = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Chỉnh pageSize lên 10 cho chuẩn UX quản trị
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, 
    total: 0,
  });

  // --- 1. FETCH DATA ---
  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await adminService.getAll(page, pageSize);
      
      const list = result.data || [];
      const totalCount = result.total || 0;

      // Map thêm key cho Antd Table
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách người dùng!');
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

  // --- 2. XÓA USER ---
  const handleDelete = async (id) => {
    try {
      await adminService.delete(id); 
      message.success('Xóa người dùng thành công!'); 
      // Tải lại trang hiện tại
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa người dùng!');
    }
  };

  // --- 3. MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingAdmin(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin) => { 
    setEditingAdmin(admin); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    handleCloseModal();
    // Refresh lại data sau khi thêm/sửa thành công
    fetchData(); 
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Người dùng
        </Title>
        
        <Flex gap="small">
          {/* Nút Refresh nhanh */}
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => fetchData()} 
            loading={loading}
          >
            Làm mới
          </Button>

          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleOpenAddModal}
          >
            Thêm mới
          </Button>
        </Flex>
      </Flex>

      {/* --- BẢNG DỮ LIỆU --- */}
      <AdminTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL --- */}
      <AdminFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingAdmin={editingAdmin} 
      />
    </div>
  );
};

export default AdminManagementPage;