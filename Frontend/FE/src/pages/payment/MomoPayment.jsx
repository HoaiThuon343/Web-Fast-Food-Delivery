import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Result, Spin, Typography } from 'antd';
import { LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch
import { removeAll } from '../../redux/features/fastfoodCart'; // 2. Import action xóa giỏ hàng

const { Title, Text } = Typography;

const MomoPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch(); // 3. Khởi tạo dispatch
    
    // Lấy orderId được truyền từ trang trước
    const { orderId } = location.state || {}; 

    const [status, setStatus] = useState('processing'); // 'processing' | 'success'

    useEffect(() => {
        // 1. Đếm ngược 3 giây mô phỏng quét QR
        const timer = setTimeout(async () => {
            try {
                // 2. (Quan trọng) XỬ LÝ THÀNH CÔNG
                // Tại đây bạn có thể gọi thêm API Backend để confirm đơn hàng nếu cần.
                
                // --- QUAN TRỌNG: XÓA GIỎ HÀNG SAU KHI THANH TOÁN ---
                dispatch(removeAll()); 
                // ---------------------------------------------------

                setStatus('success'); // Chuyển sang hiện chữ Thành công

                // 3. Đợi thêm 1.5s để người dùng đọc chữ "Thành công" rồi chuyển trang
                setTimeout(() => {
                    // Chuyển về trang theo dõi đơn và mang theo orderId để tự động load dữ liệu
                    navigate('/tracking', { state: { orderId: orderId } }); 
                }, 1500);

            } catch (error) {
                console.error("Lỗi cập nhật trạng thái:", error);
                
                // Dù lỗi API vẫn cho chuyển trang để demo không bị tắc, và vẫn xóa giỏ hàng
                dispatch(removeAll());
                setStatus('success');
                setTimeout(() => navigate('/tracking', { state: { orderId: orderId } }), 1500);
            }
        }, 3000); // 3 giây giả lập

        return () => clearTimeout(timer);
    }, [navigate, orderId, dispatch]); // Thêm dispatch vào dependency

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f0f2f5' 
        }}>
            <Card style={{ width: 400, textAlign: 'center', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                
                {/* TRẠNG THÁI 1: ĐANG HIỆN MÃ QR */}
                {status === 'processing' && (
                    <div>
                        <Title level={3} style={{ color: '#d82d8b' }}>Thanh toán MoMo</Title>
                        <div style={{ margin: '20px 0', border: '2px solid #d82d8b', padding: 10, borderRadius: 8, display: 'inline-block' }}>
                            {/* Ảnh QR Fake */}
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                                alt="Momo QR" 
                                style={{ width: 200, height: 200 }}
                            />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#d82d8b' }} spin />} />
                            <Text style={{ marginLeft: 10, display: 'block', marginTop: 10 }}>
                                Đang chờ quét mã... (3s)
                            </Text>
                        </div>
                    </div>
                )}

                {/* TRẠNG THÁI 2: THÀNH CÔNG */}
                {status === 'success' && (
                    <Result
                        status="success"
                        icon={<CheckCircleFilled style={{ color: '#52c41a', fontSize: 60 }} />}
                        title={<span style={{ color: '#52c41a', fontWeight: 'bold' }}>Thanh toán thành công!</span>}
                        subTitle="Đang chuyển hướng về trang theo dõi đơn hàng..."
                    />
                )}
            </Card>
        </div>
    );
};

export default MomoPayment;