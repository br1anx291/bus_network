import React, { useState, useEffect, useMemo } from 'react';
import { Flex, Typography, message, Button, Tabs, Input } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

import PickupRequestTable from '~/features/pickupRequests/components/PickupRequestTable/PickupRequestTable';
import { pickupRequestService } from '~/services/pickupRequestService';
import styles from './PickupRequestPage.module.css';

const { Title } = Typography;

const TAB_ITEMS = [
  {
    key: 'pending',
    label: 'Cần xử lý (Pending)',
  },
  {
    key: 'accepted',
    label: 'Đang đợi xe (Accepted)',
  },
  {
    key: 'history',
    label: 'Lịch sử (All/Others)',
  },
];

const PickupRequestPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('pending'); 
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
      let statusParam = '';
      if (activeTab === 'pending') statusParam = 'pending';
      else if (activeTab === 'accepted') statusParam = 'accepted';
      else if (activeTab === 'history') statusParam = '';
      
      const result = await pickupRequestService.getAll(1, 1000, statusParam);
      
      const list = result.data || [];
      
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách yêu cầu đón!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchText('');
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  }, [activeTab]);

  const STATUS_DICT = {
    'pending': 'chờ duyệt',
    'accepted': 'đã duyệt',
    'rejected': 'từ chối',
    'canceled': 'đã hủy',
    'completed': 'hoàn thành'
  };

  const filteredData = useMemo(() => {
    if (!searchText) return data;

    const lowerText = searchText.toLowerCase().trim();

    return data.filter((item) => {
      const userName = (item.userName || '').toLowerCase();
      const userPhone = String(item.userPhone || '').toLowerCase();
      const stationName = (item.stationName || '').toLowerCase();
      const stationAddress = (item.stationAddress || '').toLowerCase();
      const busPlate = (item.busPlate || '').toLowerCase();
      
      const statusEng = (item.status || '').toLowerCase();
      const statusViet = STATUS_DICT[statusEng] || '';

      return (
        userName.includes(lowerText) ||
        userPhone.includes(lowerText) ||
        stationName.includes(lowerText) ||
        stationAddress.includes(lowerText) ||
        busPlate.includes(lowerText) ||
        statusEng.includes(lowerText) ||
        statusViet.includes(lowerText)
      );
    });
  }, [data, searchText]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await pickupRequestService.updateStatus(id, newStatus);

      setData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      const actionMap = {
        'accepted': 'Duyệt',
        'rejected': 'Từ chối'
      };
      message.success(`Đã ${actionMap[newStatus] || 'cập nhật'} yêu cầu thành công!`);

      fetchData(); 

    } catch (error) {
      console.error(error);
      message.error('Lỗi khi cập nhật trạng thái!');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id) => handleUpdateStatus(id, 'accepted'); 
  const handleDeny = (id) => handleUpdateStatus(id, 'rejected');
  const handleCancelTrip = (id) => handleUpdateStatus(id, 'rejected');

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Yêu cầu đón
        </Title>
        
        <Flex gap="small">
            <Input.Search
                placeholder="Tìm khách, SĐT, trạm..."
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
        </Flex>
      </Flex>

      <Tabs 
        activeKey={activeTab} 
        items={TAB_ITEMS} 
        onChange={handleTabChange}
        style={{ marginBottom: 16 }} 
        type="card"
      />

      <PickupRequestTable 
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

        onApprove={handleApprove} 
        onDeny={handleDeny}
        onCancel={handleCancelTrip}     
      />
    </div>
  );
};

export default PickupRequestPage;