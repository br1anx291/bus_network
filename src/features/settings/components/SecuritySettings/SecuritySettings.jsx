// src/features/settings/components/SecuritySettings/SecuritySettings.jsx
import React from 'react';
import { Form, Input, Button, Typography, Modal, message } from 'antd';
import styles from './SecuritySettings.module.css';

const { Title } = Typography;

const SecuritySettings = () => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const onFinish = (values) => {
    modal.confirm({
      title: 'Xác nhận đổi mật khẩu?',
      content: 'Bạn có chắc chắn muốn thay đổi mật khẩu của mình không?',
      okText: 'Đổi mật khẩu',
      cancelText: 'Hủy',
      onOk: async () => {
        console.log('Đang gửi yêu cầu đổi mật khẩu:', {
          oldPass: values.oldPassword,
          newPass: values.newPassword,
        });
        
        messageApi.success('Đổi mật khẩu thành công!');
        form.resetFields();
      },
      onCancel() {
        console.log('Hủy đổi mật khẩu');
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      {messageContextHolder}
      
      <Title level={4} style={{ marginBottom: '24px' }}>
        Thay đổi mật khẩu
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu cũ"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" />
        </Form.Item>
        
        {/* --- PHẦN NÂNG CẤP NẰM Ở ĐÂY --- */}
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          // 1. THÊM DEPENDENCY: "Lắng nghe" ô 'oldPassword'
          dependencies={['oldPassword']}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            // 2. THÊM VALIDATOR MỚI
            ({ getFieldValue }) => ({
              validator(_, value) {
                // 'value' là giá trị của ô 'newPassword'
                if (!value || getFieldValue('oldPassword') !== value) {
                  // Nếu 'newPassword' rỗng, HOẶC không giống 'oldPassword' -> Thành công
                  return Promise.resolve();
                }
                // Nếu 'newPassword' TỒN TẠI và GIỐNG 'oldPassword' -> Thất bại
                return Promise.reject(new Error('Mật khẩu mới phải khác mật khẩu cũ!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']} 
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Hai mật khẩu mới không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
        {/* --- HẾT PHẦN NÂNG CẤP --- */}

        <Form.Item style={{ marginTop: '24px' }}>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SecuritySettings;