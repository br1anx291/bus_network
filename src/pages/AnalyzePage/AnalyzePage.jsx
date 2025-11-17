// src/pages/AnalyzePage/AnalyzePage.jsx
import React, { useState, useEffect } from 'react';
import { Flex, Typography, Segmented, DatePicker, Select, message } from 'antd';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

import { getAnalyticsData } from '~/features/analytics/data/analyticsMockData';
import { routeService } from '~/services/routeService'; 

import styles from './AnalyzePage.module.css';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// --- Component Chính ---
const AnalyzePage = () => {
  
  // State cho Bộ lọc
  const [timeRange, setTimeRange] = useState('Tuần này');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [allRouteOptions, setAllRouteOptions] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  
  // State cho Data Biểu đồ
  const initialData = getAnalyticsData('Tuần này', null);
  const [perfData, setPerfData] = useState(initialData.performance);
  const [pickupData, setPickupData] = useState(initialData.pickup);
  const [incidentData, setIncidentData] = useState(initialData.incident);
  const [perfXKey, setPerfXKey] = useState(initialData.performanceXKey); 

  // Tải data Tuyến (cho bộ lọc)
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoadingRoutes(true);
      try {
        const routeRes = await routeService.getRoutes(1, 1000);
        const routeOptions = [
          { value: null, label: 'Tất cả các tuyến' },
          ...routeRes.data.map(route => ({ 
            value: route.id, 
            label: `${route.name}: ${route.startPoint} - ${route.endPoint}`
          }))
        ];
        setAllRouteOptions(routeOptions);
      } catch (error) {
        message.error('Lỗi khi tải danh sách tuyến!');
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []); // Chạy 1 lần

  // Cập nhật biểu đồ KHI BỘ LỌC THAY ĐỔI
  useEffect(() => {
    try {
      const newData = getAnalyticsData(timeRange, selectedRoute);
      
      setPerfData(newData.performance);
      setPickupData(newData.pickup);
      setIncidentData(newData.incident);
      setPerfXKey(newData.performanceXKey);
      
    } catch (error) {
      console.error('Lỗi khi cập nhật biểu đồ:', error);
      message.error('Lỗi khi cập nhật dữ liệu biểu đồ!');
      
      const defaultData = getAnalyticsData('Tuần này', null);
      setPerfData(defaultData.performance);
      setPickupData(defaultData.pickup);
      setIncidentData(defaultData.incident);
      setPerfXKey(defaultData.performanceXKey);
    }
  }, [timeRange, selectedRoute]); // Kích hoạt khi state này thay đổi

  // Hàm Handler (chỉ set state)
  const handleTimeRangeChange = (value) => {
    setTimeRange(value); 
  };

  const handleRouteChange = (value) => {
    setSelectedRoute(value); 
  };
  
  return (
    <div className={styles.pageContainer}>
      {/* (Header & Filters) */}
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Phân tích & Báo cáo
        </Title>
        <Flex gap="middle" align="center">
          <Segmented 
            options={['Tuần này', 'Tháng này']} 
            value={timeRange}
            onChange={handleTimeRangeChange}
          />
          <RangePicker />
          <Select
            placeholder="Lọc theo tuyến"
            style={{ width: 300 }}
            options={allRouteOptions}
            value={selectedRoute}
            loading={loadingRoutes}
            onChange={handleRouteChange}
          />
        </Flex>
      </Flex>
      
      {/* (Biểu đồ 1) */}
      <div className={styles.chartContainer}>
        <Title level={4}>Hiệu suất đúng giờ theo thời gian</Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={perfData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={perfXKey} axisLine={false} tickLine={false} />
            <YAxis domain={[80, 100]} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend verticalAlign="bottom" />
            <Line type="monotone" dataKey="tuanNay" name="Tuần này" stroke="#1890ff" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="tuanTruoc" name="Tuần trước" stroke="#f5222d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* (Khối Biểu đồ Cột) */}
      <Flex gap="large" className={styles.barChartRow}>
        {/* Biểu đồ Yêu cầu đón */}
        <div className={styles.chartContainer} style={{ flex: 1 }}>
          <Title level={4}>Trạm được yêu cầu đón nhiều nhất</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={pickupData}
              layout="vertical"
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" position="top" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="stationName" axisLine={false} tickLine={false} width={120} />
              <Tooltip />
              <Bar dataKey="count" name="Số lượt" fill="#1890ff" barSize={20} label={{ position: 'right', fill: '#555' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Biểu đồ Sự cố */}
        <div className={styles.chartContainer} style={{ flex: 1 }}>
          <Title level={4}>Phân loại Sự cố phổ biến</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={incidentData}
              layout="vertical"
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" position="top" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" axisLine={false} tickLine={false} width={150} />
              <Tooltip />
              <Bar dataKey="count" name="Số lần" fill="#823dff" barSize={20} label={{ position: 'right', fill: '#555' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Flex>
      
    </div>
  );
};

export default AnalyzePage;