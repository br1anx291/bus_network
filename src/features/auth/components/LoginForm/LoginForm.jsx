import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Alert, Flex } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { authService } from '~/services/authService';
const { Title, Text } = Typography;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError(null);
    setIsLoading(true);

    try {
      await authService.login(values.email, values.password);

      console.log('Đăng nhập thành công, điều hướng...');
      navigate('/');

    } catch (err) {
      console.error('Lỗi đăng nhập:', err.message);
      setError(err.message || 'Đã có lỗi xảy ra');

    } finally {
      setIsLoading(false);
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
      
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
        disabled={isLoading} 
      >
        <Form.Item
          label="Nhập địa chỉ Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ Email!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Email (admin@bus.com)" 
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
            placeholder="Mật khẩu (admin123)" 
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