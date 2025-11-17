// src/features/dashboard/components/VehicleStatusPieChart/VehicleStatusPieChart.jsx
import React, { useMemo } from 'react';
import { Card, Flex, Typography, Button } from 'antd';

// 1. IMPORT TỪ THƯ VIỆN 'recharts' MỚI
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// (Import data và styles vẫn giữ nguyên)
import {
  donutData,
  STATUS_COLOR_MAP,
} from '../../data/dashboardMockData';
import styles from './VehicleStatusPieChart.module.css';

const { Text, Title } = Typography;

const dateRange = "Hôm nay, 12/10/2025"; 

const VehicleStatusPieChart = () => {

  // 2. CHUẨN BỊ DATA VÀ MÀU SẮC CHO RECHARTS
  // (Recharts dùng 'name' thay vì 'type', và 'fill' thay vì 'color')
  const chartData = useMemo(
    () => donutData.map(item => ({
      name: item.type,
      value: item.value,
      fill: STATUS_COLOR_MAP[item.type] || '#8884d8' // Gán màu
    })),
    [donutData, STATUS_COLOR_MAP]
  );
  
  // (Chúng ta không cần donutConfig của thư viện cũ nữa)

  return (
    <Card
      title={
        <Title level={4} className={styles.cardTitle}>
          Trạng thái xe
        </Title>
      }
      className={styles.card}
      bordered={false}
    >
      <Flex vertical align="center" justify="center">
        {/* --- THANH HEADER PHỤ (Giữ nguyên) --- */}
        <Flex justify="space-between" align="center" className={styles.subHeader}>
          <Text type="secondary">{dateRange}</Text>
          <Button size="small" className={styles.reportButton}>
            Xem Report
          </Button>
        </Flex>

        {/* --- 3. THAY THẾ BIỂU ĐỒ BẰNG RECHARTS --- */}
        <div className={styles.chartWrapper}>
          {/* Recharts cần set chiều cao cho ResponsiveContainer */}
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Tooltip />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%" // Căn giữa
                cy="50%" // Căn giữa
                innerRadius="60%" // <-- Tạo hiệu ứng Donut
                outerRadius="100%" // <-- Giảm nếu muốn nhỏ hơn
                fill="#8884d8" // Màu mặc định (sẽ bị đè)
                paddingAngle={0} // Không có khoảng cách
                label={false} // Tắt nhãn
                labelLine={false} // Tắt đường chỉ
                startAngle={90}  // Bắt đầu từ 12 giờ
                endAngle={-270} // Vẽ ngược chiều kim đồng hồ 360 độ
              >
                {/* Dùng <Cell> để gán màu cho từng miếng bánh */}
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* --- HẾT PHẦN THAY THẾ --- */}

        {/* --- Legend (Giữ nguyên, nó đã hoàn hảo) --- */}
        <Flex justify="space-around" align="start" className={styles.legendWrapper}>
          {donutData.map((item) => (
            <Flex key={item.type} vertical align="start" gap={4}>
              <Flex align="center" gap={8}>
                <div
                  className={styles.legendDot}
                  style={{
                    backgroundColor: STATUS_COLOR_MAP[item.type],
                  }}
                />
                <Text type="secondary" className={styles.legendType}>
                  {item.type}
                </Text>
              </Flex>
              <Text strong className={styles.legendValue}>
                {item.value}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
};

export default VehicleStatusPieChart;