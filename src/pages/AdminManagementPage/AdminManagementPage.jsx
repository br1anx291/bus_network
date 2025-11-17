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

// 3. Đổi tên Component
const AdminManagementPage = () => {
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
      // GỌI HÀM getAdmins
      const result = await adminService.getAdmins(page, pageSize); 
      const mappedData = result.data.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: result.total,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách admin!'); // Sửa text
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
      // GỌI HÀM deleteAdmin
      await adminService.deleteAdmin(id); 
      message.success('Xóa admin thành công!'); // Sửa text
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa admin!'); // Sửa text
    }
  };

  // --- 5. SỬA STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // Đổi tên state

  const handleOpenAddModal = () => {
    setEditingAdmin(null); // Đổi tên state
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin) => { // Đổi tên param
    setEditingAdmin(admin); // Đổi tên state
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
          Quản lý admin {/* Sửa text */}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={handleOpenAddModal}
        >
          Thêm admin mới {/* Sửa text */}
        </Button>
      </Flex>

      {/* --- 6. SỬA COMPONENT CON --- */}
      <AdminTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <AdminFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingAdmin={editingAdmin} // Truyền prop mới
      />
    </div>
  );
};

export default AdminManagementPage;