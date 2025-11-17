import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import { authService } from '../../../../services/authService';
const { Title, Text } = Typography;

const RegisterForm = () => {
  // --- STATE ĐỂ XỬ LÝ LOADING, LỖI, VÀ THÀNH CÔNG ---
  const [isLoading, setIsLoading] = useState(false); // <-- MỚI
  const [error, setError] = useState(null); // <-- MỚI
  const [successMessage, setSuccessMessage] = useState(null); // <-- MỚI
  const navigate = useNavigate(); // <-- MỚI

  // --- HÀM "BÓP CÒ" ---
  const onFinish = async (values) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    // Lấy data từ form
    const registerData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    try {
      // Gọi "nòng súng"
      const response = await authService.register(registerData);

      // THÀNH CÔNG!
      setSuccessMessage(response.message || 'Đăng ký thành công!');
      
      // Chờ 2 giây rồi "đá" về trang login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // THẤT BẠI! (mock ném ra lỗi 'Email đã tồn tại')
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false); // Luôn tắt loading
    }
  };

  return (
    <div className={styles.registerFormContainer}>
      <Title level={2} className={styles.title}>
        Đăng ký
      </Title>
      <Text type="secondary" className={styles.subtitle}>
        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </Text>

      {/* --- HIỂN THỊ LỖI (NẾU CÓ) --- */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: '20px' }}
        />
      )}

      {/* --- HIỂN THỊ THÀNH CÔNG (NẾU CÓ) --- */}
      {successMessage && (
        <Alert
          message={successMessage}
          description="Bạn sẽ được chuyển đến trang Đăng nhập trong 2 giây."
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
        // <-- MỚI: Vô hiệu hóa form khi đang loading hoặc đã thành công
        disabled={isLoading || successMessage}
      >
        {/* Hàng 1: Họ và Tên */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Họ"
              name="firstName"
              rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tên"
              name="lastName"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input placeholder="Tên" size="large" />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: Email */}
        <Form.Item
          label="Địa chỉ Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Email" 
            size="large" 
          />
        </Form.Item>

        {/* Hàng 3: Mật khẩu */}
        <Form.Item
          label="Nhập mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Mật khẩu" 
            size="large"
          />
        </Form.Item>

        {/* Hàng 4: Xác nhận Mật khẩu */}
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Hai mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Xác nhận mật khẩu" 
            size="large"
          />
        </Form.Item>

        {/* Hàng 5: Nút Đăng ký */}
        <Form.Item style={{ marginTop: '16px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            className={styles.registerButton} 
            size="large"
            loading={isLoading} // <-- MỚI: Thêm trạng thái loading
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;