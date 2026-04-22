import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, Tag, notification, List, Typography, Badge } from 'antd';
import { SendOutlined, EnvironmentOutlined, SyncOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import DroneMap from '../../components/DroneMap';

const { Text, Title } = Typography;

const DronePage = () => {
    const [pendingOrders, setPendingOrders] = useState([]); // Đơn chờ giao
    const [completedOrders, setCompletedOrders] = useState([]); // Đơn đã giao
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchAddress, setSearchAddress] = useState('');
    
    const [isFlying, setIsFlying] = useState(false);
    const SHOP_LOC = [10.8411, 106.8099];
    const [dronePos, setDronePos] = useState(SHOP_LOC);
    const [destPos, setDestPos] = useState(null);

    const API_BASE_URL = "http://localhost:5213/api/Orders";

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ViewAllOrder`);
            const data = response.data.Data || response.data.data || [];
            
            // 1. Lọc Đơn chờ giao (Delivering)
            setPendingOrders(data.filter(o => o.statusOrder === 'Delivering'));
            
            // 2. Lọc Đơn đã giao (Delivered/Received) - Lấy 5 đơn mới nhất
            setCompletedOrders(
                data.filter(o => o.statusOrder === 'Delivered' || o.statusOrder === 'Received')
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                    .slice(0, 5)
            );

        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        }
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setSearchAddress(order.address || ""); 
        setDestPos(null); 
        setDronePos(SHOP_LOC); 
        setIsFlying(false);
    };

    const handleSearchRealAddress = async () => {
        if (!searchAddress) return notification.warning({ message: "Vui lòng nhập địa chỉ!" });
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setDestPos([parseFloat(lat), parseFloat(lon)]);
                notification.success({ message: "Đã tìm thấy vị trí!" });
            } else {
                notification.error({ message: "Không tìm thấy địa chỉ!" });
            }
        } catch (error) {
            notification.error({ message: "Lỗi định vị" });
        }
    };

    // XỬ LÝ BAY VÀ HOÀN TẤT
    useEffect(() => {
        let interval;
        if (isFlying && destPos) {
            let step = 0;
            const totalSteps = 200; // Tăng bước lên để bay chậm hơn (dễ quan sát)
            interval = setInterval(async () => {
                step++;
                const lat = SHOP_LOC[0] + (destPos[0] - SHOP_LOC[0]) * (step / totalSteps);
                const lng = SHOP_LOC[1] + (destPos[1] - SHOP_LOC[1]) * (step / totalSteps);
                setDronePos([lat, lng]);

                if (step >= totalSteps) {
                    clearInterval(interval);
                    setIsFlying(false);
                    notification.success({ message: 'Giao hàng thành công!' });
                    
                    // --- GỌI API CẬP NHẬT TRẠNG THÁI: Delivered ---
                    if (selectedOrder) {
                        try {
                            await axios.put(`${API_BASE_URL}/UpdateOrder/${selectedOrder.orderId}`, { statusOrder: 'Delivered' });
                            fetchOrders(); // Tải lại để chuyển đơn sang cột Đã giao
                            setSelectedOrder(null);
                            setDestPos(null);
                            setDronePos(SHOP_LOC);
                        } catch (err) { console.error(err); }
                    }
                }
            }, 50); 
        }
        return () => clearInterval(interval);
    }, [isFlying, destPos]);

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <Title level={2} style={{margin: 0}}>🚁 Điều Phối Drone</Title>
                <Button icon={<SyncOutlined />} onClick={fetchOrders}>Làm mới</Button>
            </div>
            
            <Row gutter={24}>
                {/* Cột Trái */}
                <Col span={8}>
                    <Card title={<Badge count={pendingOrders.length} offset={[10, 0]}>Đơn đang chờ giao</Badge>} style={{ marginBottom: 20 }}>
                        <List
                            dataSource={pendingOrders}
                            renderItem={item => (
                                <List.Item 
                                    style={{ cursor: 'pointer', background: selectedOrder?.orderId === item.orderId ? '#e6f7ff' : '#fff', padding: 10, borderRadius: 5, marginBottom: 5, border: '1px solid #eee'}}
                                    onClick={() => handleSelectOrder(item)}
                                >
                                    <div style={{width: '100%'}}>
                                        <b>#{item.orderId.substring(0, 8)}</b> - {item.memberName}
                                        <div style={{float: 'right', color: '#faad14'}}>Delivering</div>
                                    </div>
                                </List.Item>
                            )}
                        />
                        {pendingOrders.length === 0 && <div style={{textAlign: 'center', color: '#999'}}>Không có đơn chờ</div>}
                    </Card>

                    <Card title="Lịch sử đơn đã giao ">
                        <List
                            dataSource={completedOrders}
                            renderItem={item => (
                                <List.Item>
                                    <CheckCircleOutlined style={{color: 'green', marginRight: 10}} />
                                    #{item.orderId.substring(0, 8)} - <Tag color="green">Hoàn tất</Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Cột Phải: Map */}
                <Col span={16}>
                    <Card title="Bản đồ trực tuyến" style={{ borderRadius: 10 }}>
                        <div style={{marginBottom: 10}}>
                            Đơn hàng: {selectedOrder ? <Tag color="blue">#{selectedOrder.orderId}</Tag> : <i style={{color:'#999'}}>Chưa chọn</i>}
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                            <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ khách..." value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
                            <Button type="primary" onClick={handleSearchRealAddress}>Tìm</Button>
                        </div>
                        
                        <Button type="primary" block size="large" 
                            style={{ marginBottom: 15, background: isFlying ? '#faad14' : '#52c41a' }}
                            onClick={() => setIsFlying(true)}
                            disabled={isFlying || !destPos}
                        >
                            {isFlying ? 'Drone đang bay...' : 'Gửi Drone Giao Đơn'}
                        </Button>

                        <div style={{ border: '2px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                             <DroneMap dronePosition={dronePos} destination={destPos} routePath={isFlying || destPos ? [SHOP_LOC, destPos] : null} />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default DronePage;