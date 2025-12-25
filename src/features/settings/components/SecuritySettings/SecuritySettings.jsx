import React, { useState } from 'react';
import { 
  Form, Input, Button, Typography, 
  message 
} from 'antd';
import { useNavigate } from 'react-router-dom'; 

import styles from './SecuritySettings.module.css';
import { adminService } from '~/services/adminService'; 

const { Title } = Typography;

const SecuritySettings = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate(); 

  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      await adminService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      message.success('Đổi mật khẩu thành công! Hệ thống sẽ tự động đăng xuất...', 2); 
      
      form.resetFields(); 

      await new Promise(resolve => setTimeout(resolve, 1500));

      localStorage.removeItem('accessToken'); 
      localStorage.removeItem('user');

      navigate('/login'); 

    } catch (error) {
      const responseBody = error.response?.data || error;
      
      const possibleErrorObj = {
        ...responseBody,
        ...(responseBody.data || {}),
        ...(responseBody.errors || {})
      };

      const fieldsWithError = [];

      if (
        possibleErrorObj.oldPassword || 
        possibleErrorObj.old_password || 
        possibleErrorObj.currentPassword
      ) {
        fieldsWithError.push({
          name: 'oldPassword',
          errors: ['Mật khẩu cũ không chính xác!'],
        });
      }

      const newPassErr = possibleErrorObj.password || possibleErrorObj.newPassword;
      if (newPassErr) {
        fieldsWithError.push({
          name: 'newPassword',
          errors: [newPassErr.message || 'Mật khẩu mới không hợp lệ'],
        });
      }

      const confirmErr = possibleErrorObj.passwordConfirm || possibleErrorObj.confirmPassword;
      if (confirmErr) {
        fieldsWithError.push({
          name: 'confirmPassword',
          errors: [confirmErr.message || 'Mật khẩu xác nhận không khớp'],
        });
      }

      if (fieldsWithError.length > 0) {
        form.setFields(fieldsWithError);
      } else {
        message.error(responseBody.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Thay đổi mật khẩu
      </Title>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="oldPassword"
          label="Mật khẩu cũ"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>
        
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          dependencies={['oldPassword']}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 8, message: 'Mật khẩu phải từ 8 ký tự trở lên' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('oldPassword') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu mới không được trùng mật khẩu cũ!'));
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

        <Form.Item style={{ marginTop: '24px' }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SecuritySettings;