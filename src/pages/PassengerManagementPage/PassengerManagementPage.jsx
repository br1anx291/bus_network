import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import PassengerTable from '~/features/passengers/components/PassengerTable/PassengerTable';
import PassengerFormModal from '~/features/passengers/components/PassengerFormModal/PassengerFormModal';
import { passengerService } from '~/services/passengerService';
import styles from './PassengerManagementPage.module.css';

const { Title } = Typography;

const PassengerManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchText, setSearchText] = useState('');

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    showSizeChanger: true, 
    pageSizeOptions: ['7', '10', '20', '50']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await passengerService.getAll(1, 1000);

      const list = result.data || result || [];

      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
    } catch (error) {
      message.error('Lỗi khi tải danh sách hành khách!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const STATUS_DICT = {
    'active': 'hoạt động',
    'inactive': 'ngừng hoạt động',
    'blocked': 'đã khóa'
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const phone = String(item.phone || '').toLowerCase();
      const address = (item.address || '').toLowerCase();
      
      const statusEng = (item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        name.includes(lowerText) ||
        email.includes(lowerText) ||
        phone.includes(lowerText) ||
        address.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);

  const handleDelete = async (id) => {
    try {
      await passengerService.delete(id); 
      message.success('Xóa hành khách thành công!'); 
      fetchData();
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
          <Input.Search
            placeholder="Tìm tên, email, sđt..."
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
          Thêm hành khách mới 
        </Button>
        </Flex>
      </Flex>

      <PassengerTable 
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