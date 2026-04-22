import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, List, Typography, Divider, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu từ trang ShoppingCart truyền sang
  const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };
  const user = useSelector((store) => store.account); 

  // TRƯỜNG HỢP 2: HỦY ĐƠN HÀNG -> Quay về Giỏ hàng
  const handleCancel = () => {
    navigate("/shoppingcart");
  };

  // TRƯỜNG HỢP 1: XÁC NHẬN THANH TOÁN MOMO
  const handlePayment = async () => {
    // 1. Kiểm tra đăng nhập
    if (!user || !user.UserId) {
      message.error("Vui lòng đăng nhập để thanh toán!");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // 2. Chuẩn bị dữ liệu tạo đơn hàng (Lưu vào DB trước)
      const orderPayload = {
        memberId: user.UserId, // Backend dùng memberId
        orderDate: new Date().toISOString(),
        requiredDate: new Date().toISOString(),
        shippedDate: new Date().toISOString(),
        address: user.address || "TPHCM", // Địa chỉ mặc định nếu user chưa có
        totalPrice: totalPrice,
        orderDetails: cartItems.map(item => ({
          foodId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      // 3. Gọi API tạo đơn hàng (Status: Pending)
      // Admin và Restaurant sẽ thấy đơn này ngay lập tức
      const createOrderRes = await axios.post("http://localhost:5213/api/Orders/CreateOrder", orderPayload);

      // Kiểm tra phản hồi từ Backend
      // (Lưu ý: Tùy backend trả về Data hay data, id hay orderId, code này handle cả 2 trường hợp)
      const responseData = createOrderRes.data;
      
      if (responseData.isSuccess || responseData.status === 200 || createOrderRes.status === 200) {
        
        // Lấy OrderId vừa tạo
        // Thử lấy ở data.data.id (chuẩn) hoặc data.id (dự phòng)
        const newOrderId = responseData.data?.id || responseData.data?.orderId || responseData.data;

        if (!newOrderId) {
            message.error("Lỗi: Không lấy được mã đơn hàng từ hệ thống.");
            console.error("Response data:", responseData);
            return;
        }

        // --- THAY ĐỔI Ở ĐÂY: CHUYỂN SANG TRANG MOMO ---
        // Thay vì gọi VNPAY, ta chuyển sang trang giả lập Momo và mang theo OrderId
        navigate("/payment-momo", { 
            state: { orderId: newOrderId } 
        });

      } else {
        message.error("Tạo đơn hàng thất bại: " + (responseData.message || "Lỗi không xác định"));
      }

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      const errorMsg = error.response?.data?.message || error.message || "Có lỗi xảy ra.";
      message.error("Lỗi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
        <div style={{padding: 50, textAlign: "center"}}>
            <h3>Không có thông tin đơn hàng.</h3>
            <Button onClick={handleCancel}>Quay lại giỏ hàng</Button>
        </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", padding: "0 20px" }}>
      <Card title={<Title level={3}>Xác nhận thanh toán</Title>} bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        
        {/* Danh sách món ăn */}
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`Số lượng: ${item.quantity} x ${item.price.toLocaleString()} VNĐ`}
              />
              <div style={{ fontWeight: 'bold' }}>
                {(item.quantity * item.price).toLocaleString()} VNĐ
              </div>
            </List.Item>
          )}
        />
        
        <Divider />
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <Title level={4}>Tổng thanh toán:</Title>
          <Title level={4} type="danger">{totalPrice.toLocaleString()} VNĐ</Title>
        </div>

        {/* Các nút hành động */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 15 }}>
          {/* Nút Hủy */}
          <Button size="large" onClick={handleCancel}>
            Hủy bỏ
          </Button>

          {/* Nút Thanh toán MOMO (Màu hồng đặc trưng) */}
          <Button 
            type="primary" 
            size="large" 
            onClick={handlePayment} 
            loading={loading}
            style={{ 
                background: "#d82d8b", // Màu hồng Momo
                borderColor: "#d82d8b", 
                fontWeight: "bold"
            }}
          >
            Thanh toán bằng Momo
          </Button>
        </div>

      </Card>
    </div>
  );
};

export default PaymentConfirmation;