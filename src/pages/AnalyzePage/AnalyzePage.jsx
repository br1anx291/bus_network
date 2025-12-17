import React, { useState, useEffect } from 'react';
import { Flex, Typography, Segmented, DatePicker, Select, message, Spin } from 'antd';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

import { routeService } from '~/services/routeService'; 
import { analyticsService } from '~/services/analyticsService';
import styles from './AnalyzePage.module.css';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AnalyzePage = () => {
  const [timeRange, setTimeRange] = useState('Tuần này');
  const [selectedRoute, setSelectedRoute] = useState(null);
  
  const [allRouteOptions, setAllRouteOptions] = useState([]);

  const [lineData, setLineData] = useState([]);
  const [pickupData, setPickupData] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
  
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoadingRoutes(true);
      try {
        const routeRes = await routeService.getAll(1, 100);
        const routeOptions = [
          { value: null, label: 'Tất cả các tuyến' },
          ...routeRes.data.map(route => ({ 
            value: route.id, 
            label: `${route.code} - ${route.name}`
          }))
        ];
        setAllRouteOptions(routeOptions);
      } catch (error) {
        message.error('Lỗi tải danh sách tuyến');
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []);

useEffect(() => {
    const fetchData = async () => {
      setLoadingCharts(true);
      try {
        const [lineRes, pickupRes, incidentRes] = await Promise.all([
          analyticsService.getPickupTrend(timeRange, selectedRoute),
          
          analyticsService.getTopStations(timeRange, selectedRoute),
          analyticsService.getIncidentTypes(timeRange)
        ]);

        setLineData(lineRes);
        setPickupData(pickupRes);
        setIncidentData(incidentRes);
      } catch (error) {
      } finally {
        setLoadingCharts(false);
      }
    };

    fetchData();
  }, [timeRange, selectedRoute]);

  const getLineChartTitle = () => {
    if (timeRange === 'Tuần này') return "Xu hướng Nhu cầu Đón khách (Tuần này vs Tuần trước)";
    return "Xu hướng Nhu cầu Đón khách (Tháng này vs Tháng trước)";
  };

  const getLineNames = () => {
    if (timeRange === 'Tuần này') return { cur: 'Tuần này', prev: 'Tuần trước' };
    return { cur: 'Tháng này', prev: 'Tháng trước' };
  };
  
  const labels = getLineNames();

  return (
    <div className={styles.pageContainer}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Title level={2} className={styles.pageTitle}>
          Phân tích & Báo cáo
        </Title>
        <Flex gap="middle" align="center">
          <Segmented 
            options={['Tuần này', 'Tháng này']} 
            value={timeRange}
            onChange={setTimeRange}
          />

          <RangePicker style={{ width: 240 }} /> 
          
          <Select
            placeholder="Lọc theo tuyến"
            style={{ width: 250 }}
            options={allRouteOptions}
            value={selectedRoute}
            loading={loadingRoutes}
            onChange={setSelectedRoute}
            allowClear
          />
        </Flex>
      </Flex>

      <Spin spinning={loadingCharts} tip="Đang tính toán số liệu...">

        <div className={styles.chartContainer}>
          <Title level={4}>{getLineChartTitle()}</Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} interval={timeRange === 'Tháng này' ? 2 : 0} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                formatter={(value, name) => [value, name === 'tuanNay' ? labels.cur : labels.prev]}
                labelStyle={{ color: '#333' }}
              />
              <Legend verticalAlign="bottom" />

              <Line 
                type="monotone" 
                dataKey="tuanNay" 
                name={labels.cur} 
                stroke="#1890ff" 
                strokeWidth={3} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="tuanTruoc" 
                name={labels.prev} 
                stroke="#d9d9d9" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Flex gap="large" className={styles.barChartRow} style={{ marginTop: 24 }}>

          <div className={styles.chartContainer} style={{ flex: 1 }}>
            <Title level={4}>Top Trạm có nhu cầu cao ({timeRange})</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={pickupData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" position="top" axisLine={false} tickLine={false} allowDecimals={false}/>
                <YAxis 
                  type="category" 
                  dataKey="stationName" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey="count" 
                  name="Lượt yêu cầu" 
                  fill="#1890ff" 
                  barSize={24} 
                  radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: '#666' }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className={styles.chartContainer} style={{ flex: 1 }}>
            <Title level={4}>Phân loại sự cố ({timeRange})</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={incidentData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" position="top" axisLine={false} tickLine={false} allowDecimals={false}/>
                <YAxis 
                  type="category" 
                  dataKey="type" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey="count" 
                  name="Số lần" 
                  fill="#ff4d4f" 
                  barSize={24} 
                  radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: '#666' }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Flex>

      </Spin>
    </div>
  );
};

export default AnalyzePage;