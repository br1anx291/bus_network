// src/features/settings/components/NotificationSettings/NotificationSettings.jsx
import React from 'react';
import { Form, Switch, Button, Typography, Flex } from 'antd';
import styles from './NotificationSettings.module.css';

const { Title, Text } = Typography;

// Component con cho từng hàng
const NotificationItem = ({ label, namePrefix, isCategory = false }) => {
  if (isCategory) {
    return <div className={styles.categoryTitle}>{label}</div>;
  }

  return (
    <div className={styles.settingItem}>
      <Text>{label}</Text>
      {/* Cột "Trên Web" */}
      <div>
        <Form.Item name={[namePrefix, 'web']} noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      </div>
      {/* Cột "Email" */}
      <div>
        <Form.Item name={[namePrefix, 'email']} noStyle valuePropName="checked">
          <Switch />
        </Form.Item>
      </div>
    </div>
  );
};


const NotificationSettings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Dữ liệu Cài đặt thông báo:', values);
    // (Logic gọi API lưu)
  };

  // Giả lập data ban đầu (tất cả đều bật)
  const initialValues = {
    doNotDisturb: false,
    alerts: {
      routeChanges: { web: true, email: true },
      vehicleLeft: { web: true, email: true },
      vehicleStopped: { web: true, email: true },
    },
    technical: {
      deviceOffline: { web: true, email: true },
      deviceNoSignal: { web: true, email: true },
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      className={styles.formContainer}
    >
      {/* --- KHỐI 1: KHÔNG LÀM PHIỀN --- */}
      <div className={styles.settingBlock}>
        <Flex justify="space-between" align="center">
          <div>
            <Title level={5} style={{ margin: 0 }}>Không làm phiền</Title>
            <Text type="secondary">Tạm dừng tất cả thông báo</Text>
          </div>
          <Form.Item name="doNotDisturb" noStyle valuePropName="checked">
            <Switch />
          </Form.Item>
        </Flex>
      </div>

      {/* --- KHỐI 2: CHỌN LOẠI THÔNG BÁO --- */}
      <div className={styles.settingBlock}>
        <Title level={5} style={{ marginBottom: '16px' }}>
          Chọn loại thông báo và kênh bạn muốn nhận
        </Title>

        {/* Header của Bảng */}
        <div className={styles.tableHeader}>
          <span>LOẠI THÔNG BÁO</span>
          <span>TRÊN WEB</span>
          <span>EMAIL</span>
        </div>

        {/* Các hàng */}
        <NotificationItem label="Cảnh báo Vận hành" isCategory />
        <NotificationItem label="Xe lệch tuyến" namePrefix={['alerts', 'routeChanges']} />
        <NotificationItem label="Xe rời khỏi và ra khỏi tuyến đường đã định" namePrefix={['alerts', 'vehicleLeft']} />
        <NotificationItem label="Xe dừng quá lâu" namePrefix={['alerts', 'vehicleStopped']} />

        <NotificationItem label="Cảnh báo Kỹ thuật" isCategory />
        <NotificationItem label="Thiết bị mất kết nối" namePrefix={['technical', 'deviceOffline']} />
        <NotificationItem label="Khi thiết bị gửi dữ liệu không có tín hiệu" namePrefix={['technical', 'deviceNoSignal']} />
      </div>

      {/* --- NÚT LƯU --- */}
      <Form.Item style={{ marginTop: '24px' }}>
        <Button type="primary" htmlType="submit">
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NotificationSettings;