import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

// 1. Import Bảng và Modal CỦA hành khách
import PassengerTable from '~/features/passengers/components/PassengerTable/PassengerTable';
import PassengerFormModal from '~/features/passengers/components/PassengerFormModal/PassengerFormModal';
    
// 2. Import Service CỦA hành khách
import { passengerService } from '~/services/passengerService';

import styles from './PassengerManagementPage.module.css';

const { Title } = Typography;

const PassengerManagementPage = () => {
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
      const result = await passengerService.getAll(page, pageSize);
      
      // Xử lý an toàn cho data trả về (Mock object hoặc API array)
      const list = result.data || result || [];
      const totalCount = result.total || list.length || 0;

      // Add key for Ant Design Table
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách hành khách!');
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
      await passengerService.delete(id); 
      message.success('Xóa hành khách thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa hành khách!');
    }
  };

  // --- 5. SỬA STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingPassenger(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (passenger) => { 
    setEditingPassenger(passenger); 
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
          Quản lý hành khách 
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
          Thêm hành khách mới 
        </Button>
        </Flex>
      </Flex>

      {/* --- BẢNG DỮ LIỆU --- */}
      <PassengerTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* --- MODAL --- */}
      <PassengerFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingPassenger={editingPassenger} 
      />
    </div>
  );
};

export default PassengerManagementPage;