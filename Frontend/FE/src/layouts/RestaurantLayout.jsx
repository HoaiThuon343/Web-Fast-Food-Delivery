import React from 'react';
import { Layout, Typography, Dropdown, Menu, Button } from 'antd';
import { 
  DashboardOutlined, 
  UnorderedListOutlined, 
  CoffeeOutlined, 
  RocketOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  BankOutlined, 
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from "../redux/features/userAccount"; // <--- ĐÃ SỬA ĐƯỜNG DẪN
import axios from 'axios';
import { notification } from 'antd';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const LOGOUT_API = "http://localhost:5213/api/Auth/logout"; 

const RestaurantLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.account); 
  
  // Hàm xử lý Logout
  const handleLogout = async () => {
    try {
      // 1. Gọi API Logout (nếu có)
      // await axios.post(LOGOUT_API); 
      
      // 2. Xóa thông tin khỏi Redux Store
      dispatch(logout()); 
      notification.success({ message: "Thành công", description: "Đã đăng xuất khỏi tài khoản Nhà hàng." });
      
      // 3. Chuyển về trang login
      navigate('/login');
    } catch (e) {
      console.error("Lỗi logout:", e);
      notification.error({ message: "Lỗi", description: "Không thể đăng xuất." });
    }
  };


  const menuItems = [
    { key: '/restaurant/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/restaurant/orders', icon: <UnorderedListOutlined />, label: 'Danh sách đơn hàng' },
    { key: '/restaurant/menu', icon: <CoffeeOutlined />, label: 'Quản lý món ăn' },
    { key: '/restaurant/drone', icon: <RocketOutlined />, label: 'Drone', danger: true }, 
    { key: '/restaurant/settings', icon: <SettingOutlined />, label: 'Cài đặt quán' },
    { key: '/restaurant/withdraw', icon: <BankOutlined />, label: 'Rút tiền doanh thu' },
    // Thêm nút Logout vào cuối menu (Optional)
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout }, 
  ];

  // Menu Dropdown trên Header
  const headerMenu = (
    <Menu>
      <Menu.Item key="settings" onClick={() => navigate('/restaurant/settings')}>
        <SettingOutlined /> Cài đặt quán
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} danger>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );
  
  // Lấy tên hiển thị: Nếu có fullName (tên Nhà hàng) thì dùng, nếu không thì dùng mặc định
  const displayName = user?.fullName || "Restaurant Admin"; 
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: 0 }}>FoodFast</Title>
        
        {/* --- KHU VỰC LOGIN/LOGOUT (HEADER) --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Kiểm tra xem user đã login chưa */}
          {user?.id ? (
            <Dropdown overlay={headerMenu} trigger={['click']}>
                <Button type="text" style={{ padding: 0, height: 'auto', color: '#fa8c16' }}>
                    <UserOutlined style={{ fontSize: '20px', verticalAlign: 'middle' }} />
                    <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                        {displayName} 
                    </span>
                </Button>
            </Dropdown>
          ) : (
            // Nếu chưa login (hoặc token hết hạn), hiển thị nút Login
            <Button type="primary" onClick={() => navigate('/login')}>
                Đăng nhập
            </Button>
          )}
        </div>
        {/* ----------------------------------- */}
      </Header>
      <Layout>
        <Sider width={240} theme="light" style={{ background: '#f5f5f5', padding: '20px 0' }}>
            <div style={{ padding: '0 10px' }}>
                {menuItems.map(item => (
                    <div 
                        key={item.key}
                        // Sử dụng item.onClick nếu có (cho nút Logout), ngược lại dùng navigate
                        onClick={item.onClick ? item.onClick : () => navigate(item.key)} 
                        style={{
                            padding: '12px 20px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            // Logic màu sắc
                            backgroundColor: location.pathname === item.key ? (item.danger ? '#ff4d4f' : '#d9d9d9') : 'transparent',
                            color: location.pathname === item.key ? (item.danger ? '#fff' : '#000') : '#000',
                            fontWeight: location.pathname === item.key ? 'bold' : 'normal',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        {item.icon} {item.label}
                    </div>
                ))}
            </div>
        </Sider>
        <Content style={{ margin: '0', padding: '24px', background: '#fff' }}>
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
};

export default RestaurantLayout;