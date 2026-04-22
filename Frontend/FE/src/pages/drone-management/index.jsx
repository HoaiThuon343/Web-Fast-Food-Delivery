import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Space, Form, Modal, Popconfirm, Tag, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

// Định nghĩa các trạng thái Drone
const DRONE_STATUSES = {
    READY: 'Ready',
    DELIVERING: 'Delivering',
    MAINTENANCE: 'Maintenance',
    LOW_BATTERY: 'LowBattery',
};

// Hàm lấy màu Tag theo trạng thái
const getStatusTag = (status) => {
    switch (status) {
        case DRONE_STATUSES.READY:
            return <Tag icon={<SyncOutlined spin={false} />} color="green">Sẵn sàng</Tag>;
        case DRONE_STATUSES.DELIVERING:
            return <Tag icon={<SyncOutlined spin />} color="blue">Đang giao</Tag>;
        case DRONE_STATUSES.MAINTENANCE:
            return <Tag color="red">Bảo trì</Tag>;
        case DRONE_STATUSES.LOW_BATTERY:
            return <Tag color="orange">Pin yếu</Tag>;
        default:
            return <Tag color="default">{status}</Tag>;
    }
};

const DroneManagement = () => {
    const [drones, setDrones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Lưu ý: Đảm bảo Backend đang chạy ở cổng này
    const API_BASE_URL = "http://localhost:5213/api/Drone";

    useEffect(() => {
        fetchDrones();
    }, []);

    // ------------------- API HANDLERS -------------------
    
    const fetchDrones = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/GetAll`);
            
            // Kiểm tra kỹ cấu trúc dữ liệu trả về
            // Backend trả về: { code: 200, Data: [...], ... }
            const data = response.data.Data || response.data.data || response.data; 
            
            if (Array.isArray(data)) {
                setDrones(data.map(d => ({ ...d, key: d.id })));
            } else {
                setDrones([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Drone:", error);
            // Không hiển thị notification lỗi liên tục khi mới load trang để tránh khó chịu nếu server chưa bật
        } finally {
            setLoading(false);
        }
    };

    const handleAddDrone = async (values) => {
        try {
            // SỬA LỖI Ở ĐÂY: Mapping đúng tên field mà Backend mong đợi
            // Backend (DroneCreateVM) có: NameDrone, Model
            const payload = {
                nameDrone: values.nameDrone, // Lấy đúng từ form (nameDrone) gửi sang Key backend (nameDrone)
                model: values.model
            };

            const response = await axios.post(`${API_BASE_URL}/Add`, payload);
            
            // Kiểm tra IsSuccess (Backend trả về true/false)
            if (response.data.IsSuccess || response.status === 200 || response.status === 201) {
                notification.success({ message: "Thành công", description: "Đã thêm Drone mới." });
                form.resetFields();
                setIsModalVisible(false);
                fetchDrones(); 
            } else {
                notification.error({ message: "Lỗi", description: response.data.message || "Không thể thêm Drone." });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi kết nối hoặc dữ liệu không hợp lệ.";
            notification.error({ message: "Lỗi", description: errorMessage });
        }
    };

    const handleDeleteDrone = async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Delete/${id}`);
            if (response.data.IsSuccess) {
                notification.success({ message: "Thành công", description: "Đã xóa Drone." });
                fetchDrones();
            } else {
                notification.error({ message: "Lỗi", description: response.data.message || "Không thể xóa Drone." });
            }
        } catch (error) {
            notification.error({ message: "Lỗi", description: "Lỗi kết nối khi xóa Drone." });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/UpdateStatus/${id}`, {
                status: newStatus,
                // Nếu backend cần BatteryLevel, hãy gửi kèm, nếu không thì thôi
                batteryLevel: 100 
            });
            
            if (response.data.IsSuccess) {
                notification.success({ message: "Thành công", description: `Đã cập nhật trạng thái Drone ID ${id}.` });
                fetchDrones();
            } else {
                notification.error({ message: "Lỗi", description: response.data.message || "Không thể cập nhật trạng thái." });
            }
        } catch (error) {
            notification.error({ message: "Lỗi", description: "Lỗi kết nối khi cập nhật trạng thái." });
        }
    };


    // ------------------- TABLE COLUMNS -------------------

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Tên Drone',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Pin',
            dataIndex: 'batteryLevel',
            key: 'batteryLevel',
            render: (level) => <Tag color={level > 50 ? 'green' : level > 20 ? 'orange' : 'red'}>{level}%</Tag>,
            width: 80,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: getStatusTag,
        },
        {
            title: 'Vị trí (LAT, LNG)',
            key: 'location',
            render: (text, record) => {
                const safeLat = record.currentLat ? record.currentLat.toFixed(4) : '0';
                const safeLng = record.currentLng ? record.currentLng.toFixed(4) : '0';
                return `${safeLat}, ${safeLng}`;
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 250,
            render: (text, record) => (
                <Space size="small">
                    <Select
                        defaultValue={record.status}
                        style={{ width: 120 }}
                        onChange={(value) => handleStatusChange(record.id, value)}
                        disabled={record.status === DRONE_STATUSES.DELIVERING}
                    >
                        <Option value={DRONE_STATUSES.READY}>Sẵn sàng</Option>
                        <Option value={DRONE_STATUSES.MAINTENANCE}>Bảo trì</Option>
                        <Option value={DRONE_STATUSES.LOW_BATTERY}>Pin yếu</Option>
                    </Select>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa Drone này?"
                        onConfirm={() => handleDeleteDrone(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Quản lý Drone</h2>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm Drone mới
                </Button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button icon={<ReloadOutlined />} onClick={fetchDrones}>Tải lại dữ liệu</Button>
            </div>

            <Table
                columns={columns}
                dataSource={drones}
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />

            <Modal
                title="Thêm Drone Mới"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddDrone}
                >
                    <Form.Item
                        name="nameDrone" // Key của Form
                        label="Tên Drone"
                        rules={[{ required: true, message: 'Vui lòng nhập tên Drone!' }]}
                    >
                        <Input placeholder="Ví dụ: Drone Alpha 01" />
                    </Form.Item>
                    <Form.Item
                        name="model"
                        label="Model/Loại"
                    >
                        <Input placeholder="Ví dụ: DJI Mavic 3" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Thêm Drone
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DroneManagement;