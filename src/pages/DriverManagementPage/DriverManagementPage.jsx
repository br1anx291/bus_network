import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import DriverTable from '~/features/drivers/components/DriverTable/DriverTable';
import DriverFormModal from '~/features/drivers/components/DriverFormModal/DriverFormModal';
import { driverService } from '~/services/driverService';
import styles from './DriverManagementPage.module.css';

const { Title } = Typography;

const DriverManagementPage = () => {
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
      const result = await driverService.getAll(1, 1000);
      
      const list = result.data || result || [];
      
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
    } catch (error) {
      message.error('Lỗi khi tải danh sách tài xế!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const STATUS_DICT = {
    'active': 'đang làm việc',
    'off': 'nghỉ ca',
    'leave': 'nghỉ phép'
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const name = String(item.name || '').toLowerCase();
      const email = String(item.email || '').toLowerCase();
      const phone = String(item.phone || '').toLowerCase();
      const licenseNumber = String(item.licenseNumber || '').toLowerCase();
      
      const statusEng = String(item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        name.includes(lowerText) ||
        email.includes(lowerText) ||
        phone.includes(lowerText) ||
        licenseNumber.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);

  const handleDelete = async (id) => {
    try {
      await driverService.delete(id); 
      message.success('Xóa tài xế thành công!'); 
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xóa tài xế!');
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingDriver(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (driver) => { 
    setEditingDriver(driver); 
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
          Quản lý tài xế 
        </Title>

        <Flex gap="small">
          <Input.Search
            placeholder="Tìm tên, email, bằng lái..."
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
            Thêm tài xế mới 
          </Button>
          </Flex>
      </Flex>

      <DriverTable 
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

      <DriverFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingDriver={editingDriver} 
      />
    </div>
  );
};

export default DriverManagementPage;