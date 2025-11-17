import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Alert, Flex } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { authService } from '../../../../services/authService';
const { Title, Text } = Typography;

const LoginForm = () => {
// --- STATE ĐỂ XỬ LÝ LOADING VÀ LỖI ---
  const [isLoading, setIsLoading] = useState(false); // <-- MỚI
  const [error, setError] = useState(null); // <-- MỚI
  const navigate = useNavigate(); // <-- MỚI: Hook để điều hướng

// --- HÀM "BÓP CÒ" ---
  const onFinish = async (values) => {
    setError(null); // Xóa lỗi cũ
    setIsLoading(true); // Bắt đầu tải

    try {
      // Gọi "nòng súng", bất kể là mock hay thật
      await authService.login(values.email, values.password);

      // THÀNH CÔNG! (service đã tự lưu user vào store)
      console.log('Đăng nhập thành công, điều hướng...');
      navigate('/'); // <-- MỚI: Đá người dùng về trang Dashboard

    } catch (err) {
      // THẤT BẠI! (mockLogin() ném ra lỗi 'Sai mật khẩu')
      console.error('Lỗi đăng nhập:', err.message);
      setError(err.message || 'Đã có lỗi xảy ra'); // <-- MỚI: Hiển thị lỗi

    } finally {
      setIsLoading(false); // <-- MỚI: Luôn luôn tắt loading
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <Title level={2} className={styles.title}>
        Đăng nhập
      </Title>
      <Text type="secondary" className={styles.subtitle}>
        Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </Text>

      {/* --- HIỂN THỊ LỖI NẾU CÓ --- */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)} // <-- MỚI: Cho phép tắt thông báo lỗi
          style={{ marginBottom: '20px' }}
        />
      )}
      
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
        // <-- MỚI: Vô hiệu hóa form khi đang loading
        disabled={isLoading} 
      >
        <Form.Item
          label="Tên tài khoản hoặc địa chỉ Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Email (admin@bus.com)" // Gợi ý user/pass
            size="large" 
          />
        </Form.Item>

        <Form.Item
          label="Nhập mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Mật khẩu (admin123)" // Gợi ý user/pass
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center">
            <span />
            <Link className={styles.forgotPassword} to="/forgot-password">
              Quên mật khẩu
            </Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className={styles.loginButton} 
            size="large"
            // <-- MỚI: Thêm trạng thái loading cho nút
            loading={isLoading} 
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;