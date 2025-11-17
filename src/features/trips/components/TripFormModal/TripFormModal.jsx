// src/features/trips/components/TripFormModal/TripFormModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, DatePicker, Row, Col } from 'antd'; 
import dayjs from 'dayjs'; 

// 1. Import Service
import { tripService } from '~/services/tripService'; 
import { STATUS_COLOR_MAP } from '../../data/tripMockData';

// Lấy danh sách status từ Mock Data để đồng bộ màu sắc
const statusOptions = Object.keys(STATUS_COLOR_MAP).map(status => ({
  value: status,
  label: status,
}));

const TripFormModal = ({ open, onClose, onSuccess, editingTrip }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingTrip;

  // 2. Đổ dữ liệu vào form
  useEffect(() => {
    if (open) {
      if (isEditing) {
        // Antd DatePicker cần object dayjs, không nhận string
        form.setFieldsValue({
          ...editingTrip,
          startTime: editingTrip.startTime ? dayjs(editingTrip.startTime) : null,
          endTime: editingTrip.endTime ? dayjs(editingTrip.endTime) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editingTrip, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      // 3. Chuẩn hóa dữ liệu trước khi gửi (Date -> String)
      const processedValues = {
        ...values,
        startTime: values.startTime ? values.startTime.toISOString() : null,
        endTime: values.endTime ? values.endTime.toISOString() : null,
      };

      if (isEditing) {
        // [NÂNG CẤP] Gọi hàm update (Truyền ID riêng)
        await tripService.update(editingTrip.id, processedValues);
        message.success('Cập nhật chuyến thành công!');
      } else {
        // [NÂNG CẤP] Gọi hàm create
        await tripService.create(processedValues);
        message.success('Thêm chuyến mới thành công!');
      }

      onSuccess(); // Tải lại bảng
      onClose();   // Đóng modal

    } catch (error) {
      console.error('Lỗi khi lưu thông tin chuyến:', error);
      if (error.message) {
         message.error(error.message || 'Đã có lỗi xảy ra');
      }
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
      width={600}
      okText={isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
      cancelText="Hủy bỏ"
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        name="trip_form"
        style={{ marginTop: '24px' }}
        initialValues={{ status: 'Đang chạy' }}
      >
        {/* 1. TÊN TUYẾN */}
        <Form.Item
          name="routeName"
          label="Tên tuyến"
          rules={[{ required: true, message: 'Vui lòng nhập tên tuyến!' }]}
        >
          <Input placeholder="Ví dụ: Tuyến 05" />
        </Form.Item>

        {/* 2. XE VÀ TÀI XẾ */}
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

        {/* 3. THỜI GIAN */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Thời gian khởi hành"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Thời gian kết thúc (Dự kiến)"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        {/* 4. TRẠNG THÁI */}
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