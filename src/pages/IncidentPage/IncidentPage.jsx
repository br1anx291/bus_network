import React, { useState, useEffect } from 'react';
import { Flex, Typography, message, Button } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import IncidentTable from '~/features/incidents/components/IncidentTable/IncidentTable';
import IncidentFormModal from '~/features/incidents/components/IncidentFormModal/IncidentFormModal'; 

import { incidentService } from '~/services/incidentService';
import styles from './IncidentPage.module.css';

const { Title } = Typography;

const IncidentPage = () => {
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
      const result = await incidentService.getAll(page, pageSize);
      
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
      message.error('Lỗi khi tải danh sách sự cố!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id) => {
    try {
      await incidentService.delete(id);
      message.success('Xóa sự cố thành công!');
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa sự cố!');
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  const handleOpenAddModal = () => {
    setEditingIncident(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingIncident(record);
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
          Quản lý Sự cố
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
            Báo cáo sự cố
          </Button>
        </Flex>
      </Flex>

      <IncidentTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}

        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <IncidentFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingIncident={editingIncident}
      />
    </div>
  );
};

export default IncidentPage;