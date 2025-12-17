import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import PassengerTable from '~/features/passengers/components/PassengerTable/PassengerTable';
import PassengerFormModal from '~/features/passengers/components/PassengerFormModal/PassengerFormModal';
import { passengerService } from '~/services/passengerService';
import styles from './PassengerManagementPage.module.css';

const { Title } = Typography;

const PassengerManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await passengerService.getAll(page, pageSize);

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
      await passengerService.delete(id); 
      message.success('Xóa hành khách thành công!'); 
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa hành khách!');
    }
  };

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
        editingPassenger={editingPassenger} 
      />
    </div>
  );
};

export default PassengerManagementPage;