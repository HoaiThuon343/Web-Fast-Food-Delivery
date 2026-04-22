import React, { useState, useEffect } from 'react';
import { Switch, notification, Card, Descriptions, Spin } from 'antd'; 
import axios from 'axios';
import { useSelector } from 'react-redux';

const TOGGLE_API = "http://localhost:5213/api/Restaurant/toggle-status/";
const GET_USER_DETAIL_API = "http://localhost:5213/api/User/GetUserById?id="; 

function Settings() {
    const user = useSelector(state => state.accountmanage); 
    const restaurantId = user?.id; // Lấy ID từ Redux Store

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    const fetchRestaurantDetail = async () => {
        if (!restaurantId) {
            setLoading(false);
            // THÔNG BÁO QUAN TRỌNG: Nếu ID không có, tức là chưa Login hoặc Redux bị lỗi
            notification.warning({ message: "Lỗi Login", description: "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại." }); 
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${GET_USER_DETAIL_API}${restaurantId}`);
            
            // Backend GetUserById trả về null nếu không tìm thấy
            if (response.status === 200 && response.data) {
                setRestaurant(response.data); 
            } else {
                setRestaurant(null); // Không tìm thấy user
            }
        } catch (error) {
            console.error("Lỗi API GetUserById:", error);
            setRestaurant(null); 
            notification.error({ message: "Lỗi", description: "Lỗi khi gọi API chi tiết user." });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRestaurantDetail();
    }, [restaurantId]);

        if (loading) {
        return <div style={{textAlign: 'center', marginTop: 50}}><Spin size="large" /></div>;
    }
    
    // --- CẬP NHẬT TRẠNG THÁI HIỂN THỊ CUỐI CÙNG ---
    if (!restaurant) {
        // Sau khi loading xong mà không có data
        return <div style={{textAlign: 'center', marginTop: 50}}>
            <h2>Không tìm thấy thông tin nhà hàng này.</h2>
            <p>Vui lòng kiểm tra API Login có lưu ID và Backend có hàm GetUserById không.</p>
        </div>;
    }
    // --- LOGIC ĐỔI TRẠNG THÁI ---
    const handleToggleStatus = async () => {
        if (!restaurantId) return;

        setStatusLoading(true);
        try {
            const response = await axios.put(`${TOGGLE_API}${restaurantId}`);
            
            if (response.data.isSuccess) {
                // Cập nhật lại state cục bộ và thông báo
                setRestaurant(prev => ({ ...prev, status: response.data.Data })); 
                // Cập nhật Redux Store (Optional: Để Header hiện đúng status mới)
                // dispatch(updateStatus(response.data.Data)); 
                notification.success({ message: "Thành công", description: response.data.message });
            }
        } catch (error) {
            notification.error({ message: "Lỗi", description: "Không thể đổi trạng thái quán." });
        } finally {
            setStatusLoading(false);
        }
    };

    // --- HIỂN THỊ LOADING/THIẾU DATA ---
    if (loading) {
        return <div style={{textAlign: 'center', marginTop: 50}}><Spin size="large" /></div>;
    }
    if (!restaurant) {
        return <div style={{textAlign: 'center', marginTop: 50}}>Không tìm thấy thông tin nhà hàng này. Vui lòng thử đăng nhập lại.</div>; // <--- SỬA LỖI TRỐNG
    }
    
    const isActive = restaurant.status === 'Active';

    return (
        <div className="container mt-4">
            <h2>Cài đặt quán</h2>
            
            {/* PHẦN 1: THÔNG TIN CHI TIẾT (LẤY TỪ API GetUserById) */}
            <Card title="Thông tin cơ bản" style={{ marginTop: 20 }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="ID Nhà hàng">{restaurant.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Nhà hàng">{restaurant.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{restaurant.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{restaurant.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{restaurant.address}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* PHẦN 2: TRẠNG THÁI HOẠT ĐỘNG */}
            <Card title="Trạng thái hoạt động" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        Trạng thái hiện tại: 
                        {isActive ? (
                            <strong style={{color:'green', marginLeft: 10}}>ĐANG MỞ CỬA</strong> 
                        ) : (
                            <strong style={{color:'red', marginLeft: 10}}>ĐÓNG CỬA</strong>
                        )}
                    </span>
                    <Switch 
                        checked={isActive} 
                        onChange={handleToggleStatus} 
                        loading={statusLoading}
                        checkedChildren="Mở" 
                        unCheckedChildren="Đóng" 
                    />
                </div>
            </Card>
        </div>
    );
}

export default Settings;