import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Space, Row, Col, Form, Select, message, Image, Popconfirm, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const FoodPage = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Cấu hình đường dẫn API (Kiểm tra lại Swagger của bạn xem đúng tên controller chưa)
    const API_BASE_URL = "http://localhost:5213/api"; 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Gọi API lấy danh sách món ăn
            // Giả sử API là /MenuFoodItem (hoặc /MenuFoodItem/GetAll)
            const foodRes = await axios.get(`${API_BASE_URL}/MenuFoodItem`);
            
            // 2. Gọi API lấy danh mục để đổ vào Dropdown
            const cateRes = await axios.get(`${API_BASE_URL}/Category`);

            // Xử lý dữ liệu Món ăn
            const foodData = foodRes.data.Data || foodRes.data.data || foodRes.data || [];
            setFoods(foodData.map(item => ({...item, key: item.foodId || item.id})));

            // Xử lý dữ liệu Danh mục
            const cateData = cateRes.data.Data || cateRes.data.data || cateRes.data || [];
            setCategories(cateData);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            // message.error("Không tải được dữ liệu món ăn.");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý Thêm món mới
    const handleAddFood = async (values) => {
        try {
            // Payload gửi đi phải khớp với Model Backend (MenuFoodItemCreateVM)
            const payload = {
                foodName: values.foodName,
                unitPrice: parseFloat(values.unitPrice), // Chuyển sang số
                image: values.image,
                categoryId: values.categoryId,
                status: "Available" // Mặc định là có hàng
            };

            const response = await axios.post(`${API_BASE_URL}/MenuFoodItem`, payload);

            if (response.data.IsSuccess || response.status === 200 || response.status === 201) {
                message.success("Thêm món thành công!");
                form.resetFields();
                fetchData(); // Tải lại bảng
            } else {
                message.error("Thêm thất bại: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi thêm món.");
        }
    };

    // Xử lý Xóa món
    const handleDeleteFood = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/MenuFoodItem/${id}`);
            message.success("Đã xóa món ăn.");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại.");
        }
    };

    const columns = [
        { 
            title: 'Ảnh', 
            dataIndex: 'image', 
            key: 'image',
            render: (src) => <Image width={50} src={src} fallback="https://via.placeholder.com/50" />
        },
        { 
            title: 'Tên món', 
            dataIndex: 'foodName', 
            key: 'foodName',
            render: (text) => <b>{text}</b>
        },
        { 
            title: 'Giá', 
            dataIndex: 'unitPrice', 
            key: 'unitPrice',
            render: (price) => <span style={{color: '#d4380d'}}>{price?.toLocaleString()} đ</span>
        },
        { 
            title: 'Danh mục', 
            dataIndex: 'categoryName', // Backend có thể trả về categoryName hoặc category.categoriesName
            key: 'category',
            render: (text, record) => <Tag color="blue">{text || record.category?.categoriesName || "Chưa phân loại"}</Tag>
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => <Tag color={status === 'Available' ? 'green' : 'red'}>{status || 'Available'}</Tag>
        },
        { 
            title: 'Hành động', 
            key: 'action', 
            render: (_, record) => (
                <Space>
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDeleteFood(record.foodId || record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Quản lý món ăn</h2>
            
            {/* FORM THÊM MÓN */}
            <Card title="Thêm món mới" style={{ marginBottom: 20, borderRadius: 10 }}>
                <Form form={form} onFinish={handleAddFood} layout="vertical">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="foodName" label="Tên món" rules={[{ required: true, message: 'Nhập tên món' }]}>
                                <Input placeholder="VD: Gà rán" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="unitPrice" label="Giá (VNĐ)" rules={[{ required: true, message: 'Nhập giá' }]}>
                                <Input type="number" placeholder="50000" />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                                <Select placeholder="Chọn danh mục">
                                    {categories.map(cat => (
                                        <Option key={cat.id || cat.categoryId} value={cat.id || cat.categoryId}>
                                            {cat.name || cat.categoriesName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="image" label="URL Ảnh">
                                <Input placeholder="https://..." />
                            </Form.Item>
                        </Col>
                        <Col span={3} style={{display: 'flex', alignItems: 'center', paddingTop: '10px'}}>
                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                                Thêm
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            
            {/* BẢNG DỮ LIỆU */}
            <div style={{textAlign: 'right', marginBottom: 10}}>
                <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới dữ liệu</Button>
            </div>
            
            <Table 
                columns={columns} 
                dataSource={foods} 
                bordered 
                loading={loading}
                style={{ background: '#fff', borderRadius: 10 }}
                pagination={{ pageSize: 6 }}
                rowKey="key"
            />
        </div>
    );
};

export default FoodPage;