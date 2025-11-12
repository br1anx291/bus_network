// src/components/Dashboard/VehicleStatusPieChart.jsx
import React from 'react';
// 1. Thêm Button vào import
import { Card, Flex, Typography, Button } from 'antd';
import { Pie } from '@ant-design/charts';
import {
  donutData,
  STATUS_COLOR_MAP,
} from '../../data/dashboardMockData';

const { Text, Title } = Typography;

const VehicleStatusPieChart = () => {
  const colorPalette = donutData.map(item => STATUS_COLOR_MAP[item.type]);

  const donutConfig = {
    data: donutData,
    angleField: 'value',
    colorField: 'type',
    scale: {
      color: { range: colorPalette },
    },
    color: colorPalette,
    innerRadius: 0.6,
    height: 200,
    legend: false,
    label: false,
    statistic: { title: false, content: false },
  };

  const dateRange = "Hôm nay, 12/10/2025";

  return (
    <Card 
      title={
        <Title level={4} style={{ margin: 0 }}>
          Trạng thái xe
        </Title>
      }
      style={{ height: '100%' }}
      bordered={false}
    >
      <Flex vertical align="center" justify="center">
        
        {/* 2. TẠO THANH HEADER PHỤ (Ngang hàng: Text trái - Nút phải) */}
        <Flex justify="space-between" align="center" style={{ width: '100%', marginBottom: '16px' }}>
           
           {/* Text: Căn trái */}
           <Text type="secondary">
             {dateRange}
           </Text>

           {/* Nút Xem Report: Căn phải */}
           <Button 
             size="small" 
             style={{ 
               backgroundColor: '#ffffff',
               borderColor: '#d9d9d9', // Viền đen nhạt
               color: '#FFC107',       // Chữ màu vàng
               fontWeight: '500',
               textShadow: '0 1px 2px rgba(0, 0, 0, 0)', // Bóng chữ nhẹ
               boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' // Thêm xíu bóng cho nút nổi lên
             }}
           >
             Xem Report
           </Button>

        </Flex>

        {/* Chart */}
        <div style={{ width: '100%' }}>
           <Pie {...donutConfig} />
        </div>

        {/* Legend */}
        <Flex justify="space-around" align="start" style={{ marginTop: '32px', width: '100%' }}>
          {donutData.map((item) => (
            <Flex key={item.type} vertical align="start" gap={4}>
              <Flex align="center" gap={8}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: STATUS_COLOR_MAP[item.type],
                  }}
                />
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  {item.type}
                </Text>
              </Flex>
              <Text strong style={{ fontSize: '20px', lineHeight: 1, paddingLeft: '16px' }}>
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