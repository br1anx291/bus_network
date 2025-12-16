// src/features/settings/components/ProfileSettings/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { 
    Form, Input, Button, Row, Col, DatePicker, Select, 
    Avatar, Upload, Typography, Flex, Spin, App, message
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './ProfileSettings.module.css';
import dayjs from 'dayjs'; 
import { adminService } from '~/services/adminService'; 

const { Title, Text } = Typography;
const { Option } = Select;

const ProfileSettings = () => {

    const [form] = Form.useForm();
    
    const [loading, setLoading] = useState(true); 
    const [submitting, setSubmitting] = useState(false); // State loading cho nút Update
    
    // Dữ liệu dùng để hiển thị UI tĩnh (Avatar, Tên chào)
    const [userData, setUserData] = useState(null); 
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null); 

    // --- 1. LOAD DỮ LIỆU ---
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const user = await adminService.getProfile();
                
                // Chuẩn bị dữ liệu cho Form
                const formData = {
                    username: user.username,
                    email: user.email,
                    // Lưu ý: Key này phải khớp với 'name' trong Form.Item
                    phone: user.phoneNumber, 
                    dob: user.dob ? dayjs(user.dob) : null, 
                    gender: user.gender,
                };

                setUserData(user); // Lưu user gốc để hiển thị tên chào
                setCurrentAvatarUrl(user.avatarUrl);
                
                // Fill dữ liệu vào Form
                form.setFieldsValue(formData);
                
            } catch (error) {
                console.error("Lỗi tải hồ sơ:", error);
                message.error("Không thể tải thông tin.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [form, message]); 

    // --- 2. UPLOAD AVATAR ---
    const handleUploadChange = async (info) => {
        if (info.file.status === 'uploading') return;
        if (info.file.status === 'done') {
            try {
                const updatedUser = await adminService.updateAvatar(info.file.originFileObj);
                setCurrentAvatarUrl(updatedUser.avatarUrl);
                message.success("Tải ảnh thành công.");
            } catch (error) {
                message.error("Lỗi tải ảnh.");
            }
        }
    };
    const customUploadRequest = ({ file, onSuccess, onError }) => {
        handleUploadChange({ file: { status: 'done', originFileObj: file, name: file.name }, onSuccess, onError });
        onSuccess(); 
    };

    // --- 3. SUBMIT FORM (LOGIC TRỰC TIẾP, KHÔNG MODAL) ---
    const onFinish = async (values) => {
        console.log("LOG: User bấm nút Update. Values:", values);
        
        // Bắt đầu hiệu ứng loading trên nút
        setSubmitting(true);

        try {
            // Chuẩn bị payload gửi Service
            await new Promise(resolve => setTimeout(resolve, 800));
            const payload = {
                gender: values.gender,
                phoneNumber: values.phone, // Lấy từ input name="phone"
                dob: values.dob ? values.dob.toISOString() : null, 
            };
            
            // Gọi Service update
            await adminService.updateProfile(payload);
            
            // Nếu chạy đến đây là thành công
            message.success('Cập nhật thành công!');
            
            // Cập nhật lại tên hiển thị nếu cần (dù ở đây ta dùng username nên ko đổi)
            // setUserData({ ...userData, ...payload }); 

        } catch (error) {
            console.error('Lỗi Update:', error);
            
            // Hiển thị lỗi chi tiết từ PocketBase
            let errorMessage = 'Cập nhật thất bại.';
            if (error.response?.data?.data) {
                const errors = error.response.data.data;
                const keys = Object.keys(errors);
                // Ví dụ: phone_number: Must be unique
                if (keys.length > 0) errorMessage = `${keys[0]}: ${errors[keys[0]].message}`; 
            }
            message.error(errorMessage);
        } finally {
            // Tắt loading dù thành công hay thất bại
            setSubmitting(false);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin nhập!');
    };
    // --- 4. RENDER ---
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    return (
        <div className={styles.formContainer}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                {/* HEAD & AVATAR */}
                <Flex justify="space-between" align="top" style={{ marginBottom: '24px' }}>
                    <Title level={4} style={{ margin: 0 }}>Chào, {userData?.username || 'User'}</Title>
                    <Text type="secondary">{dayjs().format('DD/MM/YYYY')}</Text> 
                </Flex>

                <div className={styles.avatarUploader}>
                    <Avatar size={100} src={currentAvatarUrl} icon={<UserOutlined />} style={{ border: '1px solid #eee' }} />
                    <div className={styles.avatarActions}>
                        <Upload name="avatar" showUploadList={false} customRequest={customUploadRequest}>
                            <Button icon={<UploadOutlined />}>Upload New Image</Button>
                        </Upload>
                    </div>
                </div>
                
                {/* FORM FIELDS */}
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item name="username" label="Username">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item name="dob" label="Ngày sinh">
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        
                        <Form.Item name="gender" label="Giới tính">
                            <Select>
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                                <Option value="other">Khác</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={12}>
                        <Form.Item name="email" label="Email">
                            <Input disabled />
                        </Form.Item>
                        
                        <Form.Item 
                            name="phone" 
                            label="Số điện thoại"
                            hasFeedback
                            rules={[{ pattern: /^[0-9]+$/, message: 'Chỉ nhập số' },
                              { len: 10, message: 'Số điện thoại phải có đúng 10 chữ số' },
                            ]}
                        >
                            <Input placeholder="Nhập 10 chữ số..." count={{ show: true, max: 10 }} maxLength={10} />
                        </Form.Item>
                    </Col>
                </Row>
                
                <Form.Item style={{ marginTop: '24px' }}>
                    {/* Nút bấm có trạng thái loading trực tiếp */}
                    <Button type="primary" htmlType="submit" loading={submitting}>
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