import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Row, Col, Spin } from 'antd'; 

import { incidentService } from '~/services/incidentService'; 
import pb from '~/api/pocketbase';

const { TextArea } = Input;

const CATEGORY_OPTIONS = [
  { value: 'technical', label: 'Kỹ thuật / Xe' },
  { value: 'personnel', label: 'Nhân sự' },
  { value: 'traffic',   label: 'Giao thông' },
  { value: 'other',     label: 'Khác' },
];

const SEVERITY_OPTIONS = [
  { value: 'low',    label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high',   label: 'Cao / Khẩn cấp' },
];

const STATUS_OPTIONS = [
  { value: 'pending',    label: 'Mới tiếp nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'resolved',   label: 'Đã giải quyết' },
];

const IncidentFormModal = ({ open, onClose, onSuccess, editingIncident }) => { 
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  const [busOptions, setBusOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const isEditing = !!editingIncident;

  useEffect(() => {
    const fetchOptions = async () => {
      if (!open) return;
      setIsLoadingOptions(true);
      try {
        const [buses, drivers] = await Promise.all([
          pb.collection('buses').getFullList({ sort: 'license_plate' }),
          pb.collection('drivers').getFullList({ sort: 'name' }),
        ]);

        setBusOptions(buses.map(b => ({ label: b.license_plate, value: b.id })));
        setDriverOptions(drivers.map(d => ({ label: d.name, value: d.id })));
      } catch (error) {
        console.error("Lỗi load options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [open]);

  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue({
          title: editingIncident.title,
          description: editingIncident.description,
          category: editingIncident.category,
          severity: editingIncident.severity,
          status: editingIncident.status,
          busId: editingIncident.busId || undefined,
          driverId: editingIncident.driverId || undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          severity: 'low',
          category: 'technical',
          status: 'pending'
        });
      }
    }
  }, [editingIncident, form, isEditing, open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      if (isEditing) {
        await incidentService.update(editingIncident.id, values);
        message.success('Cập nhật sự cố thành công!');
      } else {
        await incidentService.create(values);
        message.success('Đã ghi nhận sự cố mới!');
      }

      onSuccess();
      onClose();  

    } catch (error) {
      console.error('Lỗi form:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Cập nhật Sự cố' : 'Báo cáo Sự cố Mới'}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isLoading}
      width={700}
      okText={isEditing ? 'Lưu thay đổi' : 'Gửi báo cáo'}
      cancelText="Hủy bỏ"
    >
      <Spin spinning={isLoadingOptions} tip="Đang tải dữ liệu...">
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Tiêu đề sự cố"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Ví dụ: Xe hỏng điều hòa, Va chạm nhẹ..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Phân loại"
                rules={[{ required: true, message: 'Chọn loại sự cố!' }]}
              >
                <Select options={CATEGORY_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={isEditing ? 12 : 24}>
              <Form.Item
                name="severity"
                label="Mức độ nghiêm trọng"
                rules={[{ required: true, message: 'Chọn mức độ!' }]}
              >
                <Select options={SEVERITY_OPTIONS} />
              </Form.Item>
            </Col>
            
            {isEditing && (
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái xử lý"
                  rules={[{ required: true }]}
                >
                  <Select options={STATUS_OPTIONS} />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="busId"
                label="Xe liên quan (Nếu có)"
              >
                <Select 
                  placeholder="Chọn xe buýt" 
                  options={busOptions}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="driverId"
                label="Tài xế liên quan (Nếu có)"
              >
                <Select 
                  placeholder="Chọn tài xế" 
                  options={driverOptions}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
          >
            <TextArea rows={4} placeholder="Mô tả diễn biến sự cố, địa điểm, thiệt hại..." />
          </Form.Item>

        </Form>
      </Spin>
    </Modal>
  );
};

export default IncidentFormModal;