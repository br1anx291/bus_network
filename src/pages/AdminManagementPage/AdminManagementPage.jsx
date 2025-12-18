import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'; 
import AdminTable from '~/features/admins/components/AdminTable/AdminTable';
import AdminFormModal from '~/features/admins/components/AdminFormModal/AdminFormModal';
import { adminService } from '~/services/adminService';
import styles from './AdminManagementPage.module.css';

const { Title } = Typography;

const AdminManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchText, setSearchText] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, 
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAll(1, 1000);
      
      const list = result.data || [];

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
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

  const ROLE_DICT = {
    'superadmin': 'quản trị viên',
    'staff': 'nhân viên',
    'manager': 'quản lý'
  };

  const STATUS_DICT = {
    'active': 'Đã xác thực',
    'pending': 'chưa xác thực',
    'blocked': 'bị khóa'
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const name = String(item.name || '').toLowerCase();
      const username = String(item.username || '').toLowerCase();
      const email = String(item.email || '').toLowerCase();
      const phoneNumber = String(item.phoneNumber || '').toLowerCase();
      
      const roleEng = String(item.role || '').toLowerCase();
      const roleViet = ROLE_DICT[roleEng] || '';

      const statusEng = String(item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        name.includes(lowerText) ||
        username.includes(lowerText) ||
        email.includes(lowerText) ||
        phoneNumber.includes(lowerText) ||
        roleEng.includes(lowerText) ||
        roleViet.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);

  const handleDelete = async (id) => {
    try {
      await adminService.delete(id); 
      message.success('Xóa người dùng thành công!'); 
      fetchData(); 
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
          <Input.Search
            placeholder="Tìm tên, email, sđt, quyền..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            enterButton={<SearchOutlined />}
          />

          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
                setSearchText('');
                fetchData();
            }} 
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
        data={filteredData}
        loading={loading}
        
        pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: pagination.pageSizeOptions,
            onChange: (page, pageSize) => {
                setPagination({ ...pagination, current: page, pageSize });
            }
        }}

        onTableChange={() => {}}
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