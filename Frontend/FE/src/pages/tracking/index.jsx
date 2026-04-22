import React, { useState, useEffect } from "react";
import { Input, Button, Card, Table, Tag, Steps, message, Typography } from "antd";
import { SearchOutlined, CarOutlined, CheckCircleOutlined, SolutionOutlined, UserOutlined, FireOutlined, RocketOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DroneMap from "../../components/DroneMap"; // Nhớ import Map

const TrackingPage = () => {
  // ... (Giữ nguyên các state cũ: phone, orders, loading...)
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { orderId } = location.state || {};

  // --- STATE CHO MAP ---
  const SHOP_LOC = [10.8411, 106.8099];
  const [dronePos, setDronePos] = useState(SHOP_LOC);
  const [destPos, setDestPos] = useState(null);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    if (orderId) fetchOrderDetail(orderId);
    // Tự động cập nhật trạng thái mỗi 5s để biết khi nào Drone giao xong
    const interval = setInterval(() => { if(orderId) fetchOrderDetail(orderId); }, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5213/api/Orders/ViewOrderByID/${id}`);
      if (response.data && response.data.data) {
        const orderData = response.data.data;
        setOrders([orderData]);

        // --- LOGIC KÍCH HOẠT BAY TRÊN MAP USER ---
        if (orderData.statusOrder === 'Delivering' && !isFlying) {
            // Nếu đơn hàng đang giao, bắt đầu tìm địa chỉ và bay
            geocodeAndFly(orderData.address || "TPHCM");
        }
      }
    } catch (error) { console.error(error); }
  };

  const geocodeAndFly = async (address) => {
      try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
          if (response.data && response.data.length > 0) {
              const { lat, lon } = response.data[0];
              setDestPos([parseFloat(lat), parseFloat(lon)]);
              setIsFlying(true); // Bắt đầu bay
          }
      } catch(e) {}
  };

  // --- LOGIC BAY GIẢ LẬP (Giống bên Restaurant) ---
  useEffect(() => {
      let interval;
      if (isFlying && destPos) {
          let step = 0;
          const totalSteps = 200; // Bay trong 10s (50ms * 200)
          interval = setInterval(() => {
              step++;
              const lat = SHOP_LOC[0] + (destPos[0] - SHOP_LOC[0]) * (step / totalSteps);
              const lng = SHOP_LOC[1] + (destPos[1] - SHOP_LOC[1]) * (step / totalSteps);
              setDronePos([lat, lng]);
              if (step >= totalSteps) {
                  clearInterval(interval);
                  // setIsFlying(false); // Giữ nguyên vị trí cuối
              }
          }, 50);
      }
      return () => clearInterval(interval);
  }, [isFlying, destPos]);


  // ... (Giữ nguyên hàm getStatusDisplay và columns cũ) ...
  // Hàm lấy trạng thái hiển thị
    const getStatusDisplay = (statusOrder) => {
        switch (statusOrder) {
            case 'Pending': return { text: "Đã thanh toán", color: "orange", step: 0 };
            case 'Paid': return { text: "Nhà hàng đã nhận món ăn", color: "blue", step: 1 };
            case 'Cooking': return { text: "Nhà hàng đang chuẩn bị món ăn", color: "purple", step: 2 };
            case 'Ready': return { text: "Drone đang giao", color: "cyan", step: 3 };
            case 'Delivering': return { text: "Drone đang bay đến bạn...", color: "geekblue", step: 3 };
            case 'Delivered': return { text: "Giao hàng thành công", color: "green", step: 4 };
            default: return { text: "Đã giao", color: "green", step: 4 };
        }
    };
    
    const columns = [
        { title: "Mã đơn", dataIndex: "orderId", key: "orderId", render: (text) => <b>{text.substring(0, 8)}...</b> },
        { title: "Tổng tiền", dataIndex: "totalPrice", key: "totalPrice", render: (price) => `${price?.toLocaleString()} VNĐ` },
        { 
          title: "Trạng thái", 
          dataIndex: "statusOrder", 
          key: "statusOrder",
          render: (status) => {
            const display = getStatusDisplay(status);
            return <Tag color={display.color}>{display.text}</Tag>;
          }
        },
    ];

  const currentOrder = orders[0];
  const currentStatusInfo = currentOrder ? getStatusDisplay(currentOrder.statusOrder) : { step: 0 };

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Theo dõi đơn hàng</h2>
      
      {/* ... (Phần ô tìm kiếm giữ nguyên) ... */}

      {orders.length > 0 && (
          <Card>
             <Steps
                current={currentStatusInfo.step}
                items={[
                  { title: 'Đặt đơn', icon: <SolutionOutlined /> },
                  { title: 'Đã nhận', icon: <UserOutlined /> },
                  { title: 'Đang nấu', icon: <FireOutlined /> },
                  { title: 'Drone giao', icon: <RocketOutlined /> },
                  { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
                ]}
                style={{ marginBottom: 30 }}
              />

              {/* HIỂN THỊ BẢN ĐỒ NẾU ĐANG GIAO */}
              {(currentOrder.statusOrder === 'Delivering' || currentOrder.statusOrder === 'Delivered') && (
                  <div style={{ marginBottom: 30, border: '2px solid #1890ff', borderRadius: 8, overflow: 'hidden' }}>
                      <DroneMap dronePosition={dronePos} destination={destPos} routePath={isFlying ? [SHOP_LOC, destPos] : null} />
                  </div>
              )}

            <Table dataSource={orders} columns={columns} rowKey="orderId" pagination={false} />
          </Card>
      )}
    </div>
  );
};

export default TrackingPage;