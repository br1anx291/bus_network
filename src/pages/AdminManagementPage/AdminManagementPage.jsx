import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'; 
import AdminTable from '~/features/admins/components/AdminTable/AdminTable';
import AdminFormModal from '~/features/admins/components/AdminFormModal/AdminFormModal';
import { adminService } from '~/services/adminService';
import styles from './AdminManagementPage.module.css';

const { Title } = Typography;

const AdminManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, 
    total: 0,
  });

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await adminService.getAll(page, pageSize);
      
      const list = result.data || [];
      const totalCount = result.total || 0;

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

  const handleDelete = async (id) => {
    try {
      await adminService.delete(id); 
      message.success('Xóa người dùng thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa người dùng!');
    }
  };

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
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Admin
        </Title>
        
        <Flex gap="small">
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
        editingAdmin={editingAdmin} 
      />
    </div>
  );
};

export default AdminManagementPage;