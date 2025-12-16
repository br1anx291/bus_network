// src/features/settings/components/NotificationSettings/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { Form, Switch, Button, Typography, Flex, message, Spin } from 'antd';
import styles from './NotificationSettings.module.css';
import { useNotification } from '~/contexts/NotificationContext';

const { Title, Text } = Typography;


const NotificationItem = ({ label, namePrefix, isCategory = false, disabled = false }) => {
  if (isCategory) {
    return <div className={styles.categoryTitle}>{label}</div>;
  }

  return (
    <div className={`${styles.settingItem} ${disabled ? styles.itemDisabled : ''}`}>
      <Text disabled={disabled}>{label}</Text>
      
      {/* Cột "Trên Web" */}
      <div>
        <Form.Item 
            name={[...namePrefix, 'web']} 
            noStyle 
            valuePropName="checked"
        >
          <Switch disabled={disabled} />
        </Form.Item>
      </div>

      {/* Cột "Email" */}
      <div>
        <Form.Item 
            name={[...namePrefix, 'email']} 
            noStyle 
            valuePropName="checked"
        >
          <Switch disabled={disabled} />
        </Form.Item>
      </div>
    </div>
  );
};

// --- Component chính ---
const NotificationSettings = () => {

  const { settings, updateSettings } = useNotification();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const doNotDisturb = Form.useWatch('doNotDisturb', form);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings, form]);


  const onFinish = async (values) => {
    setSubmitting(true); // 1. Bắt đầu quay
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await updateSettings(values);  
      message.success('Cập nhật cài đặt thành công!');
      
    } catch (err) {
      message.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!settings) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin tip="Đang tải cấu hình từ hệ thống..." size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={styles.formContainer}
    >
      {/* --- KHỐI 1: NÚT KHÔNG LÀM PHIỀN --- */}
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

      {/* --- KHỐI 2: DANH SÁCH CẤU HÌNH --- */}
      <div className={styles.settingBlock}>
        <Title level={5} style={{ marginBottom: '16px' }}>
          Chọn loại thông báo và kênh bạn muốn nhận
        </Title>

        <div className={styles.tableHeader}>
          <span>LOẠI THÔNG BÁO</span>
          <span>TRÊN WEB</span>
          <span>EMAIL</span>
        </div>

        
        {/* --- Nhóm Vận hành --- */}
        <NotificationItem label="Cảnh báo Vận hành" isCategory />
        <NotificationItem 
            label="Xe lệch tuyến" 
            namePrefix={['alerts', 'routeChanges']} 
            disabled={doNotDisturb}
        />
        <NotificationItem 
            label="Xe rời khỏi và ra khỏi tuyến đường đã định" 
            namePrefix={['alerts', 'vehicleLeft']} 
            disabled={doNotDisturb}
        />
        <NotificationItem 
            label="Xe dừng quá lâu" 
            namePrefix={['alerts', 'vehicleStopped']} 
            disabled={doNotDisturb}
        />

        {/* --- Nhóm Kỹ thuật --- */}
        <NotificationItem label="Cảnh báo Kỹ thuật" isCategory />
        <NotificationItem 
            label="Thiết bị mất kết nối" 
            namePrefix={['technical', 'deviceOffline']} 
            disabled={doNotDisturb}
        />
        <NotificationItem 
            label="Khi thiết bị gửi dữ liệu không có tín hiệu" 
            namePrefix={['technical', 'deviceNoSignal']} 
            disabled={doNotDisturb}
        />
      </div>

      {/* --- NÚT LƯU --- */}
      <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={submitting} 
          size="large"
        >
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NotificationSettings;