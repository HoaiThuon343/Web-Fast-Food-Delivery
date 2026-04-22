import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Steps, Modal, List, Avatar, Typography, Card } from 'antd';
import { FireOutlined, CheckCircleOutlined, EyeOutlined, SyncOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const RestaurantOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Modal chi tiết
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const API_BASE_URL = "http://localhost:5213/api/Orders";

    useEffect(() => {
        fetchOrders();
        // Tự động làm mới dữ liệu mỗi 10 giây để nhận đơn mới
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    // 1. Lấy danh sách đơn hàng
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/ViewAllOrder`);
            const data = response.data.Data || response.data.data || [];
            
            // Sắp xếp đơn mới nhất lên đầu
            const sortedData = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Hàm hiển thị chi tiết món ăn
    const showOrderDetails = async (orderId) => {
        setIsModalOpen(true);
        setDetailsLoading(true);
        setSelectedOrderDetails([]); 

        try {
            const response = await axios.get(`${API_BASE_URL}/ViewOrderByID/${orderId}`);
            if (response.data.IsSuccess || response.status === 200) {
                const data = response.data.Data || response.data.data;
                setSelectedOrderDetails(data.orderDetails || []);
            } else {
                message.error("Không tìm thấy chi tiết đơn hàng");
            }
        } catch (error) {
            console.error("Lỗi tải chi tiết:", error);
            message.error("Lỗi khi tải chi tiết món ăn");
        } finally {
            setDetailsLoading(false);
        }
    };

    // 3. Cập nhật trạng thái đơn hàng (QUAN TRỌNG)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const payload = { statusOrder: newStatus };
            const response = await axios.put(`${API_BASE_URL}/UpdateOrder/${orderId}`, payload);

            if (response.data.IsSuccess || response.status === 200) {
                message.success('Trạng thái đã được cập nhật!');
                fetchOrders(); // Tải lại danh sách ngay lập tức
            } else {
                message.error("Cập nhật thất bại: " + response.data.message);
            }
        } catch (error) {
            console.error(error);
            message.error("Lỗi kết nối khi cập nhật");
        }
    };

    // Cấu hình bảng
    
    const columns = 
    [
        {
            title: 'Mã đơn',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text) => <b>#{text.substring(0, 8)}</b>,
            width: 90,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'memberName', 
            key: 'memberName',
            render: (text) => <span style={{fontWeight: 500}}>{text || "Khách vãng lai"}</span>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => (
                <div style={{fontSize: 12, color: '#666'}}>
                    {new Date(date).toLocaleTimeString('vi-VN')} <br/>
                    {new Date(date).toLocaleDateString('vi-VN')}
                </div>
            ),
        },
        {
            title: 'Chi tiết',
            key: 'items',
            render: (_, record) => (
                <Button size="small" icon={<EyeOutlined />} onClick={() => showOrderDetails(record.orderId)}>
                    Xem món
                </Button>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => {
                // Nếu không có giá, hiện 0 hoặc N/A
                const value = price ? price.toLocaleString() : "0";
                return <span style={{color: '#d4380d', fontWeight: 'bold'}}>{value} đ</span>;
            },
        },

        // --- CẬP NHẬT CỘT TIẾN ĐỘ ---
        
        // --- CẬP NHẬT CỘT HÀNH ĐỘNG ---
        // --- 1. SỬA CỘT TIẾN ĐỘ (Thêm bước Đang giao) ---
        {
            title: 'Tiến độ nhà hàng',
            dataIndex: 'statusOrder',
            key: 'statusOrder',
            width: 350, // Tăng chiều rộng để chứa đủ 4 bước
            render: (status) => {
                let currentStep = 0;
                // Paid/Pending -> Bước 0 (Đã nhận)
                if (status === 'Paid' || status === 'Pending') currentStep = 0; 
                // Cooking -> Bước 1 (Đang nấu)
                if (status === 'Cooking') currentStep = 1;  
                // Ready -> Bước 2 (Đã xong - Đợi Drone)
                if (status === 'Ready') currentStep = 2;
                // Delivering -> Bước 3 (Đang giao)
                if (status === 'Delivering') currentStep = 3;

                // Nếu Hoàn tất hoặc Hủy
                if (status === 'Delivered') return <Tag color="green">Giao thành công</Tag>;
                if (status === 'Cancelled') return <Tag color="red">Đã hủy</Tag>;

                return (
                    <Steps
                        current={currentStep}
                        size="small"
                        items={[
                            { title: 'Nhận', icon: <ClockCircleOutlined /> },
                            { title: 'Nấu', icon: <FireOutlined /> },
                            { title: 'Xong', icon: <CheckCircleOutlined /> },
                            { title: 'Giao', icon: <RocketOutlined /> }, // Thêm bước này
                        ]}
                    />
                );
            }
        },

        // --- 2. SỬA CỘT HÀNH ĐỘNG (Logic nút bấm) ---
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                // [Trạng thái 1] Mới nhận -> Bấm để NẤU
                if (record.statusOrder === 'Paid' || record.statusOrder === 'Pending') {
                    return (
                        <Button 
                            type="primary" 
                            icon={<FireOutlined />} 
                            style={{background: '#fa8c16', borderColor: '#fa8c16', width: '100%'}}
                            onClick={() => updateOrderStatus(record.orderId, 'Cooking')}
                        >
                            Bắt đầu nấu
                        </Button>
                    );
                }

                // [Trạng thái 2] Đang nấu -> Bấm để HOÀN TẤT (Ra món)
                if (record.statusOrder === 'Cooking') {
                    return (
                        <Button 
                            type="primary" 
                            icon={<CheckCircleOutlined />} 
                            style={{background: '#52c41a', borderColor: '#52c41a', width: '100%'}}
                            onClick={() => updateOrderStatus(record.orderId, 'Ready')}
                        >
                            Hoàn tất món
                        </Button>
                    );
                }

                // [Trạng thái 3] Đã xong (Ready) -> Bấm để GIAO CHO DRONE
                // Đây là bước bạn đang thiếu
                if (record.statusOrder === 'Ready') {
                    return (
                        <Button 
                            type="primary"
                            icon={<RocketOutlined />} 
                            style={{background: '#1890ff', borderColor: '#1890ff', width: '100%'}}
                            onClick={() => updateOrderStatus(record.orderId, 'Delivering')}
                        >
                            Giao cho Drone
                        </Button>
                    );
                }

                // [Trạng thái 4] Đang giao (Delivering) -> Bấm để KẾT THÚC
                if (record.statusOrder === 'Delivering' || record.statusOrder === 'InTransit') {
                    return (
                         <Button 
                            type="dashed"
                            style={{color: '#52c41a', borderColor: '#52c41a', width: '100%'}}
                            onClick={() => updateOrderStatus(record.orderId, 'Delivered')}
                        >
                            Xác nhận đã giao
                        </Button>
                    );
                }

                if (record.statusOrder === 'Delivered') {
                    return <Tag color="green">Hoàn thành</Tag>;
                }

                return <Tag>{record.statusOrder}</Tag>;
            }
        },
    ];
    

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                    <h2 style={{ margin: 0, color: '#333' }}>👨‍🍳 Bếp & Quản lý Đơn Hàng</h2>
                    <Button type="primary" ghost icon={<SyncOutlined />} onClick={fetchOrders}>Làm mới dữ liệu</Button>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={orders} 
                    rowKey="orderId"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                />
            </Card>

            {/* Modal chi tiết món ăn */}
            <Modal 
                title={<div style={{ textAlign: 'center', fontSize: 18 }}>Chi tiết món ăn</div>}
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} 
                footer={[
                    <Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>
                        Đóng
                    </Button>
                ]}
                centered
            >
                {detailsLoading ? (
                    <div style={{textAlign: 'center', padding: 30}}>Đang tải dữ liệu...</div>
                ) : (
                    selectedOrderDetails && selectedOrderDetails.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={selectedOrderDetails}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar 
                                                size={50} 
                                                src="https://joeschmoe.io/api/v1/random" 
                                                style={{ backgroundColor: '#fff1f0', border: '1px solid #ffa39e' }} 
                                                icon={<FireOutlined style={{color: '#ff4d4f'}} />} 
                                            />
                                        }
                                        title={<Text strong style={{fontSize: 16}}>{item.foodName || item.FoodName || "Món #" + item.foodId}</Text>}
                                        description={
                                            <div style={{marginTop: 5}}>
                                                <Tag color="blue">SL: {item.quantity}</Tag>
                                                <Text type="secondary">x {item.unitPrice?.toLocaleString()} đ</Text>
                                            </div>
                                        }
                                    />
                                    <div style={{ fontWeight: 'bold', color: '#d4380d', fontSize: 16 }}>
                                        {(item.quantity * item.unitPrice)?.toLocaleString()} đ
                                    </div>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                            <p>Không có thông tin chi tiết món.</p>
                        </div>
                    )
                )}
            </Modal>
        </div>
    );
};

export default RestaurantOrderPage;