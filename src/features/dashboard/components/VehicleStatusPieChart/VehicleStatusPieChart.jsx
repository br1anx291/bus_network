// src/features/dashboard/components/VehicleStatusPieChart/VehicleStatusPieChart.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Card, Flex, Typography, Button, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { dashboardService } from '~/services/dashboardService';
import styles from './VehicleStatusPieChart.module.css';

const { Text, Title } = Typography;

// --- ĐỊNH NGHĨA MÀU SẮC (Hardcode để giữ đúng màu bạn thích) ---
const STATUS_COLORS = {
  'Đang chạy':   '#52c41a', // Xanh lá
  'Bảo trì':     '#faad14', // Vàng cam
  'Ngoại tuyến': '#bfbfbf', // Xám
};

const VehicleStatusPieChart = ({ refreshKey }) => {
  const navigate = useNavigate(); // Hook điều hướng
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await dashboardService.getVehicleStatusStats();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [refreshKey]);

  // 2. Tính tổng (để tính %)
  const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);

  return (
    <Card
      title={
        <Title level={4} className={styles.cardTitle}>
          Trạng thái xe
        </Title>
      }
      className={styles.card}
      bordered={false}
      style={{ height: '100%' }} // Đảm bảo chiều cao đầy đủ
    >
      <Spin spinning={loading}>
        <Flex vertical align="center" justify="center" style={{ minHeight: '300px' }}>
          
          {/* Header phụ */}
          <Flex justify="space-between" align="center" className={styles.subHeader} style={{ width: '100%', marginBottom: 20 }}>
            <Text type="secondary">Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</Text>
            {/* SỬA NÚT REPORT TẠI ĐÂY */}
            <Button 
              size="small" 
              className={styles.reportButton}
              onClick={() => navigate('/van-hanh/quan-ly-xe')} // Chuyển hướng sang trang Quản lý xe
            >
              Chi tiết
            </Button>
          </Flex>

          {/* --- BIỂU ĐỒ --- */}
          {total > 0 ? (
            <>
              <div className={styles.chartWrapper} style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip formatter={(value) => [`${value} xe`, 'Số lượng']} />
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.type] || '#8884d8'} 
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* --- CHÚ THÍCH (LEGEND) --- */}
              <Flex justify="center" gap={20} wrap="wrap" style={{ marginTop: 20 }}>
                {data.map((item) => (
                  <Flex key={item.type} align="center" gap={8}>
                    {/* Chấm màu */}
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[item.type],
                      }}
                    />
                    <Text type="secondary">{item.type}</Text>
                    <Text strong>{item.value}</Text>
                  </Flex>
                ))}
              </Flex>
            </>
          ) : (
            <Empty description="Chưa có dữ liệu xe" />
          )}

        </Flex>
      </Spin>
    </Card>
  );
};

export default VehicleStatusPieChart;