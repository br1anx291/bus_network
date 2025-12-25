import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Flex } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'; 
import styles from './ForgotPasswordPage.module.css';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    
    console.log('Đang gửi yêu cầu reset cho email:', values.email);
    
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true); 
      message.success('Đã gửi liên kết đặt lại mật khẩu!');
    }, 1500);
  };

  const renderForm = () => (
    <Form
      name="forgot_password"
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="email"
        label="Email đăng ký"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input 
          prefix={<MailOutlined className="site-form-item-icon" />} 
          placeholder="example@bus.com" 
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className={styles.submitButton} loading={loading}>
          Gửi liên kết xác nhận
        </Button>
      </Form.Item>
    </Form>
  );

  const renderSuccess = () => (
    <Flex vertical align="center" gap="middle">
      <div style={{ fontSize: 48, color: '#52c41a' }}>
        <MailOutlined />
      </div>
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>Kiểm tra email của bạn</Title>
      <Text type="secondary" style={{ textAlign: 'center' }}>
        Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra cả hộp thư rác.
      </Text>
      <Button type="primary" onClick={() => navigate('/login')} style={{ marginTop: 16 }}>
        Quay lại Đăng nhập
      </Button>
      <Button type="link" onClick={() => setIsSuccess(false)}>
        Thử lại với email khác
      </Button>
    </Flex>
  );

  return (
    <div className={styles.container}>
      <Card className={styles.card} bordered={false}>
        {!isSuccess && (
          <>
            <Title level={3} className={styles.title}>Quên Mật Khẩu?</Title>
            <Text className={styles.subtitle}>
              Đừng lo lắng. Nhập email của bạn và chúng tôi sẽ giúp bạn lấy lại mật khẩu.
            </Text>
            {renderForm()}
          </>
        )}

        {isSuccess && renderSuccess()}

        {!isSuccess && (
          <div className={styles.backLink}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeftOutlined /> Quay lại Đăng nhập
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;