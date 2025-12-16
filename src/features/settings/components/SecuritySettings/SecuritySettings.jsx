import React, { useState } from 'react';
import { 
  Form, Input, Button, Typography, 
  message 
} from 'antd';
// 1. Import hook điều hướng
import { useNavigate } from 'react-router-dom'; 

import styles from './SecuritySettings.module.css';
import { adminService } from '~/services/adminService'; 

// Giả sử bạn có authService để handle logout (hoặc bạn có thể xóa localStorage trực tiếp)
// import { authService } from '~/services/authService';

const { Title } = Typography;

const SecuritySettings = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  // 2. Khởi tạo hook điều hướng
  const navigate = useNavigate(); 

  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      // Delay giả lập UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Gọi API thay đổi mật khẩu
      await adminService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      // --- TRƯỜNG HỢP THÀNH CÔNG (UPDATED) ---
      
      // Bước A: Thông báo cho user biết
      message.success('Đổi mật khẩu thành công! Hệ thống sẽ tự động đăng xuất...', 2); // Hiển thị trong 2s
      
      // Bước B: Reset form (Optional, vì đằng nào cũng logout)
      form.resetFields(); 

      // Bước C: Delay 1.5s để user kịp đọc thông báo trước khi màn hình chuyển
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Bước D: Dọn dẹp Token & Logout
      // TODO: Thay thế dòng này bằng hàm logout thực tế của dự án bạn
      // Ví dụ: authService.logout(); hoặc dispatch(logoutAction());
      localStorage.removeItem('accessToken'); 
      localStorage.removeItem('user');

      // Bước E: Điều hướng về trang login
      navigate('/login'); 

    } catch (error) {
      // --- GIỮ NGUYÊN LOGIC CATCH CŨ CỦA BẠN ---
      const responseBody = error.response?.data || error;
      
      const possibleErrorObj = {
        ...responseBody,
        ...(responseBody.data || {}),
        ...(responseBody.errors || {})
      };

      const fieldsWithError = [];

      // 1. Check lỗi Mật khẩu cũ
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

      // 2. Check lỗi Mật khẩu mới
      const newPassErr = possibleErrorObj.password || possibleErrorObj.newPassword;
      if (newPassErr) {
        fieldsWithError.push({
          name: 'newPassword',
          errors: [newPassErr.message || 'Mật khẩu mới không hợp lệ'],
        });
      }

      // 3. Check lỗi Confirm
      const confirmErr = possibleErrorObj.passwordConfirm || possibleErrorObj.confirmPassword;
      if (confirmErr) {
        fieldsWithError.push({
          name: 'confirmPassword',
          errors: [confirmErr.message || 'Mật khẩu xác nhận không khớp'],
        });
      }

      // --- HIỂN THỊ ---
      if (fieldsWithError.length > 0) {
        form.setFields(fieldsWithError);
      } else {
        message.error(responseBody.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
      }

    } finally {
      // Lưu ý: Nếu đã navigate đi rồi thì component có thể unmount,
      // việc setSubmitting(false) có thể gây warning "Can't perform state update on unmounted component".
      // Tuy nhiên trong đa số các trường hợp hiện đại, React tự xử lý được hoặc warning này không quá nghiêm trọng.
      // Nếu muốn kỹ tính, có thể check if (!unmounted) setSubmitting(false).
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