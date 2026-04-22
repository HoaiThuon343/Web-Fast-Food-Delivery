import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, notification } from 'antd'; // Ant Design components
import axios from 'axios';

// Đảm bảo đường dẫn này đúng với action của bạn
import { login } from "../redux/features/userAccount"; 

// API Login của Backend
const LOGIN_API_ENDPOINT = "http://localhost:5213/api/Auth/login"; // Sửa port nếu cần

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Gọi API Login
            const response = await axios.post(LOGIN_API_ENDPOINT, {
                userName: values.username, // Tên trường phải khớp với API Backend
                password: values.password
            });

            if (response.data.isSuccess) {
                const userData = response.data.data; 

                // 1. LƯU THÔNG TIN ĐẦY ĐỦ VÀO REDUX STORE
                // Đảm bảo bạn đang lấy đúng các trường cần thiết: id, role, fullName
                dispatch(login({
                    id: userData.id,
                    fullName: userData.fullName,
                    role: userData.roleName || userData.role, // Lấy role (cả 2 tên phổ biến)
                    email: userData.email,
                    // Giả sử API trả về token, bạn cũng lưu ở đây:
                    token: userData.token, 
                    // ... các trường khác
                }));
                
                notification.success({ message: "Thành công", description: "Đăng nhập thành công!" });

                // 2. CHUYỂN HƯỚNG DỰA TRÊN ROLE
                const userRole = userData.roleName || userData.role;

                if (userRole === 'Admin') {
                    navigate('/dashboard');
                } else if (userRole === 'Restaurant') {
                    navigate('/restaurant/settings'); // CHUYỂN HƯỚNG ĐÚNG VÀO TRANG NHÀ HÀNG
                } else {
                    navigate('/'); // User thường
                }
            } else {
                 notification.error({ message: "Lỗi đăng nhập", description: response.data.message || "Tên đăng nhập hoặc mật khẩu không đúng." });
            }
        } catch (error) {
            console.error("Lỗi API Login:", error);
            const msg = error.response?.data?.message || "Lỗi kết nối đến server.";
            notification.error({ message: "Lỗi", description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Đăng nhập</h2>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    label="Tên đăng nhập (Username)"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;