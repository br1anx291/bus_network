import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import { authService } from '../../../../services/authService';
const { Title, Text } = Typography;

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate(); 

  const onFinish = async (values) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const registerData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword,
    };

    try {
      const response = await authService.register(registerData);

      setSuccessMessage(response.message || 'Đăng ký thành công!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
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
        disabled={isLoading || successMessage}
      >
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

        <Form.Item style={{ marginTop: '16px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            className={styles.registerButton} 
            size="large"
            loading={isLoading}
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;