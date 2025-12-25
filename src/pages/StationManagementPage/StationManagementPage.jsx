import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex, Typography, message, Input } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import StationTable from '~/features/stations/components/StationTable/StationTable';
import StationFormModal from '~/features/stations/components/StationFormModal/StationFormModal';
import { stationService } from '~/services/stationService';
import { useLocation } from 'react-router-dom';

import styles from './StationManagementPage.module.css';

const { Title } = Typography;

const StationManagementPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
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
      const result = await stationService.getAll(1, 1000);
      
      const list = result.data || result || [];
      
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      setData(mappedData);
    } catch (error) {
      message.error('Lỗi khi tải danh sách trạm!'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchText(searchParam);
    }
  }, [location.search]);

  const STATUS_DICT = {
    'active': 'hoạt động',
    'stopped': 'ngừng hoạt động',
    'maintenance': 'bảo trì'
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const address = (item.address || '').toLowerCase();
      
      const statusEng = (item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        name.includes(lowerText) ||
        address.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);

  const handleDelete = async (id) => {
    try {
      await stationService.delete(id); 
      message.success('Xóa trạm thành công!'); 
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xóa trạm!'); 
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null); 

  const handleOpenAddModal = () => {
    setEditingStation(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (station) => { 
    setEditingStation(station); 
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
          Quản lý trạm 
        </Title>

        <Flex gap="small">
          <Input.Search
            placeholder="Tìm tên trạm, địa chỉ..."
            allowClear
            value={searchText}
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
            Thêm trạm mới 
          </Button>
        </Flex>
      </Flex>

      <StationTable 
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

      <StationFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        editingStation={editingStation} 
      />
    </div>
  );
};

export default StationManagementPage;