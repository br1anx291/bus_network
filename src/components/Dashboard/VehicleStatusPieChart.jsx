// src/components/Dashboard/VehicleStatusPieChart.jsx
import React from 'react';
import { Card, Flex, Typography } from 'antd';
import { Pie } from '@ant-design/charts';
import {
  donutData,
  STATUS_COLOR_MAP,
} from '../../data/dashboardMockData'; // Import data

const { Text } = Typography;

// Config biểu đồ được định nghĩa BÊN TRONG component cần nó
const donutConfig = {
  data: donutData,
  angleField: 'value',
  colorField: 'type',
  color: (type) => STATUS_COLOR_MAP[type] || '#000',
  innerRadius: 0.6,
  height: 200,
  legend: false,
  label: false,
  statistic: {
    title: false,
    content: false,
  },
};

const VehicleStatusPieChart = () => {
  return (
    <Card title="Trạng thái xe" style={{ height: '100%' }}>
      <Pie {...donutConfig} />
      <Flex vertical gap="small" style={{ marginTop: '24px' }}>
        {donutData.map((item) => (
          <Flex justify="space-between" align="center" key={item.type}>
            <Flex gap="middle" align="center">
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: STATUS_COLOR_MAP[item.type],
                }}
              />
              <Text>{item.type}</Text>
            </Flex>
            <Text strong>{item.value}</Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
};

export default VehicleStatusPieChart;