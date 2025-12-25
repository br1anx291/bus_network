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
    const [submitting, setSubmitting] = useState(false);
    
    const [userData, setUserData] = useState(null); 
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null); 

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const user = await adminService.getProfile();
                
                const formData = {
                    username: user.username,
                    email: user.email,
                    phone: user.phoneNumber, 
                    dob: user.dob ? dayjs(user.dob) : null, 
                    gender: user.gender,
                };

                setUserData(user);
                setCurrentAvatarUrl(user.avatarUrl);
                
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

    const onFinish = async (values) => {
        console.log("LOG: User bấm nút Update. Values:", values);
        
        setSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const payload = {
                gender: values.gender,
                phoneNumber: values.phone,
                dob: values.dob ? values.dob.toISOString() : null, 
            };
            
            await adminService.updateProfile(payload);
            
            message.success('Cập nhật thành công!');
            
        } catch (error) {
            console.error('Lỗi Update:', error);
            
            let errorMessage = 'Cập nhật thất bại.';
            if (error.response?.data?.data) {
                const errors = error.response.data.data;
                const keys = Object.keys(errors);
                if (keys.length > 0) errorMessage = `${keys[0]}: ${errors[keys[0]].message}`; 
            }
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin nhập!');
    };
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