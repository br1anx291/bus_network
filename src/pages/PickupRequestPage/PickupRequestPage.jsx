// src/pages/PickupRequestPage/PickupRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { Flex, Typography, message, Button, Tabs } from 'antd'; // <--- 1. Import Tabs
import { ReloadOutlined } from '@ant-design/icons';

import PickupRequestTable from '~/features/pickupRequests/components/PickupRequestTable/PickupRequestTable';
import { pickupRequestService } from '~/services/pickupRequestService';
import styles from './PickupRequestPage.module.css';

const { Title } = Typography;

// --- ĐỊNH NGHĨA CÁC TAB ---
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
    key: 'history', // Tab này sẽ lấy tất cả (All)
    label: 'Lịch sử (All/Others)',
  },
];

const PickupRequestPage = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State quản lý Tab hiện tại, mặc định là 'pending'
  const [activeTab, setActiveTab] = useState('pending'); 

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // --- 1. FETCH DATA (Đã nâng cấp để nhận status) ---
  const fetchData = async (
    page = pagination.current, 
    pageSize = pagination.pageSize, 
    currentTab = activeTab // Nhận thêm tham số tab
  ) => {
    setLoading(true);
    try {
      // LOGIC MAPPING TỪ TAB -> STATUS API
      // Backend service đã được sửa để nhận status string
      let statusParam = '';
      
      if (currentTab === 'pending') statusParam = 'pending';
      else if (currentTab === 'accepted') statusParam = 'accepted';
      else if (currentTab === 'history') statusParam = ''; // Rỗng = Lấy tất cả
      
      const result = await pickupRequestService.getAll(page, pageSize, statusParam);
      
      const list = result.data || [];
      const totalCount = result.total || 0;

      // Map thêm key
      const mappedData = list.map((item) => ({ ...item, key: item.id }));
      
      setData(mappedData);
      setPagination({
        ...pagination,
        current: page,
        total: totalCount,
      });
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải danh sách yêu cầu đón!');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. USE EFFECT CHO TAB ---
  // Mỗi khi đổi Tab -> Reset về trang 1 và gọi lại API
  useEffect(() => {
    const newPagination = { ...pagination, current: 1 };
    setPagination(newPagination);
    fetchData(1, newPagination.pageSize, activeTab);
  }, [activeTab]);

  const handleTableChange = (newPagination) => {
    // Khi bấm chuyển trang, nhớ truyền activeTab hiện tại vào
    fetchData(newPagination.current, newPagination.pageSize, activeTab);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // useEffect sẽ tự động lo việc fetch data
  };

  // --- 3. HÀM XỬ LÝ CHUNG (CORE LOGIC) ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      
      // BƯỚC 1: Gọi API cập nhật xuống DB
      await pickupRequestService.updateStatus(id, newStatus);
      
      // BƯỚC 2: CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC (Optimistic UI Update)
      setData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      // Feedback
      const actionMap = {
        'accepted': 'Duyệt',
        'rejected': 'Từ chối'
      };
      message.success(`Đã ${actionMap[newStatus] || 'cập nhật'} yêu cầu thành công!`);

      // [TÙY CHỌN] Nếu muốn dòng đó biến mất ngay khỏi tab hiện tại sau khi xử lý
      // thì có thể bỏ comment dòng dưới đây để load lại dữ liệu từ server:
      // fetchData(pagination.current, pagination.pageSize, activeTab);

    } catch (error) {
      console.error(error);
      message.error('Lỗi khi cập nhật trạng thái!');
      // Nếu lỗi thì tải lại data cũ
      fetchData(pagination.current, pagination.pageSize, activeTab);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. CÁC HÀM SỰ KIỆN CỤ THỂ ---
  const handleApprove = (id) => handleUpdateStatus(id, 'accepted'); 
  const handleDeny = (id) => handleUpdateStatus(id, 'rejected');
  const handleCancelTrip = (id) => handleUpdateStatus(id, 'rejected');

  return (
    <div className={styles.pageContainer}>
      {/* --- HEADER --- */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Quản lý Yêu cầu đón
        </Title>
        
        <Button 
          icon={<ReloadOutlined />} 
          onClick={() => fetchData(pagination.current, pagination.pageSize, activeTab)}
          loading={loading}
        >
          Làm mới
        </Button>
      </Flex>

      {/* --- TABS BỘ LỌC (MỚI THÊM) --- */}
      <Tabs 
        activeKey={activeTab} 
        items={TAB_ITEMS} 
        onChange={handleTabChange}
        style={{ marginBottom: 16 }} 
        type="card" // Giao diện dạng thẻ nhìn chuyên nghiệp hơn
      />

      {/* --- TABLE --- */}
      <PickupRequestTable 
        data={data}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        
        // Truyền 3 hàm xử lý xuống Table
        onApprove={handleApprove} 
        onDeny={handleDeny}
        onCancel={handleCancelTrip}     
      />
    </div>
  );
};

export default PickupRequestPage;