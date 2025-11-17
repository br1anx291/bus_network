// src/pages/AdminManagementPage/AdminManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA admin
import AdminTable from '~/features/admins/components/AdminTable/AdminTable';
import AdminFormModal from '~/features/admins/components/AdminFormModal/AdminFormModal';
    
// 2. Import Service CỦA admin
import { adminService } from '~/services/adminService';

import styles from './AdminManagementPage.module.css';

const { Title } = Typography;

const AdminManagementPage = () => {
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
      const result = await adminService.getAll(page, pageSize);
      
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
      message.error('Lỗi khi tải danh sách admin!');
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
      await adminService.delete(id); 
      message.success('Xóa admin thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa admin!');
    }
  };

  // --- 5. SỬA STATE MODAL ---
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
    fetchData(); 
  };

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER CỦA TRANG --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý admin 
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm admin mới 
        </Button>
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