// src/features/trips/components/TripFormModal/TripFormModal.jsx
import React, { useEffect, useState } from 'react';
// 1. Import thêm Row, Col
import { Modal, Form, Input, Select, message, DatePicker, Row, Col } from 'antd'; 
import dayjs from 'dayjs'; // 2. Import dayjs để xử lý date

import { tripService } from '~/services/tripService'; 
import { STATUS_COLOR_MAP } from '../../data/tripMockData';

const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));

const TripFormModal = ({ open, onClose, onSuccess, editingTrip }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingTrip;

  useEffect(() => {
    if (isEditing) {
      // 3. Phải convert string sang dayjs object cho DatePicker
      form.setFieldsValue({
        ...editingTrip,
        startTime: editingTrip.startTime ? dayjs(editingTrip.startTime) : null,
        endTime: editingTrip.endTime ? dayjs(editingTrip.endTime) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingTrip, form, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      // 4. Convert dayjs object về lại string (nếu cần)
      const processedValues = {
        ...values,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
      };

      if (isEditing) {
        await tripService.updateTrip(editingTrip.id, processedValues);
        message.success('Cập nhật chuyến thành công!');
      } else {
        await tripService.createTrip(processedValues);
        message.success('Thêm chuyến mới thành công!');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Lỗi khi lưu thông tin chuyến:', error);
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa thông tin chuyến' : 'Thêm chuyến mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      forceRender
      width={600} // Mở rộng modal cho 2 cột date
    >
      {/* 5. SỬA FORM */}
      <Form
        form={form}
        layout="vertical"
        name="trip_form"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="routeName"
          label="Tên tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 05" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="vehiclePlate"
              label="Biển số xe"
              rules={[{ required: true, message: 'Vui lòng nhập biển số xe!' }]}
            >
              <Input placeholder="Ví dụ: 50H-12345" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="driverName"
              label="Tên tài xế"
              rules={[{ required: true, message: 'Vui lòng nhập tên tài xế!' }]}
            >
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
            </Form.Item>
          </Col>
        </Row>

        {/* 6. Thêm Row/Col cho Start/End Time */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Thời gian khởi hành"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Thời gian kết thúc (Dự kiến)"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select
            options={statusOptions}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TripFormModal;