// src/features/settings/components/ProfileSettings/ProfileSettings.jsx
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  DatePicker, 
  Select, 
  Avatar, 
  Upload, 
  Typography, 
  Flex,
  Modal, // Giữ lại Modal
  message // Giữ lại message
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './ProfileSettings.module.css';
import dayjs from 'dayjs'; // Đảm bảo bạn đã chạy 'npm install dayjs'

const { Title, Text } = Typography;
const { Option } = Select;

// Giả lập data người dùng hiện tại
const currentUser = {
  name: 'Tuyết My',
  username: 'tuyetmy_admin',
  email: 'my.tuyet@bus.com',
  phone: '0901234567',
  dob: '1995-10-20',
  gender: 'Nữ',
  avatarUrl: 'https://i.pravatar.cc/150?u=tuyetmy'
};

const ProfileSettings = () => {
  const [form] = Form.useForm();
  
  // State để cập nhật tên
  const [displayName, setDisplayName] = useState(currentUser.name); 

  // --- 1. SỬ DỤNG HOOKS (Cách làm chuẩn của Antd v5) ---
  const [modal, contextHolder] = Modal.useModal(); // Hook cho Modal
  const [messageApi, messageContextHolder] = message.useMessage(); // Hook cho Message

  // Chuẩn bị data cho Form (DatePicker cần đối tượng dayjs)
  const initialValues = {
    ...currentUser,
    dob: currentUser.dob ? dayjs(currentUser.dob, 'YYYY-MM-DD') : null
  };
  
  // Giả lập logic upload
  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      messageApi.success(`${info.file.name} file uploaded successfully`);
      // Logic cập nhật avatar...
    } else if (info.file.status === 'error') {
      messageApi.error(`${info.file.name} file upload failed.`);
    }
  };

  // Hàm xử lý khi nhấn nút "Update Profile"
  const onFinish = (values) => {
    // --- 2. DÙNG BIẾN TỪ HOOK ---
    modal.confirm({
      title: 'Xác nhận cập nhật hồ sơ?',
      content: 'Bạn có chắc chắn muốn lưu các thay đổi này không?',
      okText: 'Lưu thay đổi',
      cancelText: 'Hủy',
      onOk: async () => {
        // (Giả lập gọi API)
        console.log('Đang lưu data mới:', values);
        
        // --- 3. DÙNG BIẾN TỪ HOOK ---
        messageApi.success('Cập nhật hồ sơ thành công!');
        
        // Cập nhật lại tên chào mừng
        setDisplayName(values.name);
      },
      onCancel() {
        console.log('Hủy cập nhật');
      },
    });
  };
  
  return (
    <div className={styles.formContainer}>
      {/* 4. ĐẶT CONTEXT HOLDER VÀO (để chúng biết "nơi" hiển thị) */}
      {contextHolder}
      {messageContextHolder}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        {/* --- HÀNG 1: AVATAR & TIÊU ĐỀ --- */}
        <Flex justify="space-between" align="top" style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0 }}>Chào, {displayName}</Title>
          <Text type="secondary">Tue, 07 June 2022</Text>
        </Flex>

        {/* --- HÀNG 2: UPLOAD --- */}
        <div className={styles.avatarUploader}>
          <Avatar size={100} src={currentUser.avatarUrl} icon={<UserOutlined />} />
          <div className={styles.avatarActions}>
            <Upload
              name="avatar"
              showUploadList={false}
              // action="API_UPLOAD_CỦA_BẠN"
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Upload New Image</Button>
            </Upload>
            <Button danger>Remove Image</Button>
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
            At least 80 X 80 px recommended. JPG or PNG...
          </Text>
        </div>
        
        {/* --- HÀNG 3: FORM FIELDS --- */}
        <Row gutter={24}>
          {/* Cột trái */}
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Họ và tên">
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item name="dob" label="Ngày tháng năm sinh">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
          
          {/* Cột phải */}
          <Col xs={24} md={12}>
            <Form.Item name="username" label="Username">
              <Input placeholder="Username" disabled />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Email" disabled />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        
        {/* --- HÀNG 4: NÚT BẤM --- */}
        <Form.Item style={{ marginTop: '24px' }}>
          <Button type="primary" htmlType="submit">
            Update Profile
          </Button>
          <Button htmlType="button" style={{ marginLeft: '12px' }} onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileSettings;