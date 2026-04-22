import { useEffect, useState } from "react";
import {
  ProfileOutlined,
  HeartOutlined,
  UserOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  AppstoreAddOutlined,
  ShopOutlined,
  MailOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [items, setItems] = useState([]);
  const [key, setKey] = useState();
  const location = useLocation();
  const currentURI =
    location.pathname.split("/")[location.pathname.split("/").length - 1];
  const role = "admin"; // Trong thực tế nên lấy từ Redux hoặc LocalStorage

  const dataOpen = JSON.parse(localStorage.getItem("keys")) ?? [];
  const [openKeys, setOpenKeys] = useState(dataOpen);

  useEffect(() => {
    if (role === "owner") {
      // ... (Giữ nguyên code owner cũ)
    }
    if (role === "staff") {
      // ... (Giữ nguyên code staff cũ)
    }

    if (role === "admin") {
      setItems([
        getItem("MenuFoodItem", "MenuFoodItem", <AppstoreAddOutlined />),
        getItem("Category", "category", <AppstoreAddOutlined />),
        
        // --- SỬA TÊN MENU TẠI ĐÂY ---
        getItem("OrderList", "OrderAdmin", <ShopOutlined />), // Label: OrderList, Key: OrderAdmin (để khớp Router)
        // ----------------------------

        getItem("ViewAllFeedBack", "viewallfeedback", <MailOutlined />),
        
        // --- SỬA MENU ACCOUNTS ---
        getItem("Accounts", "accounts", <TeamOutlined />, [
            getItem("UserAccount", "accounts"),
            getItem("Restaurant Account", "restaurant"), // Đổi tên hiển thị
            getItem("New Restaurant", "addrestaurant"),  // Đổi tên hiển thị
        ]),
        // -------------------------

        getItem("Quản lý Drone", "dronemanagement", <TruckOutlined />),
        getItem("Report", "report", <BarChartOutlined />),
        getItem("Report Revenue", "reportrevenue", <BarChartOutlined />),
      ]);
    }
  }, []);

  const handleSubMenuOpen = (keyMenuItem) => {
    setOpenKeys(keyMenuItem);
  };
  const handleSelectKey = (keyPath) => {
    setKey(keyPath);
  };

  useEffect(() => {
    localStorage.setItem("keys", JSON.stringify(openKeys));
  }, [openKeys]);

  useEffect(() => {
    handleSubMenuOpen([...openKeys, key]);
  }, [currentURI]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["profile"]}
          mode="inline"
          selectedKeys={currentURI}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
        >
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((subItem) => (
                  <Menu.Item
                    key={subItem.key}
                    onClick={(e) => handleSelectKey(e.keyPath[1])}
                  >
                    <Link to={`/dashboard/${subItem.key}`}>
                      {subItem.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={`/dashboard/${item.key}`}>{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <header></header>
        </Header>
        <Content
          style={{ margin: "0 16px", display: "flex", flexDirection: "column" }}
        >
          <Breadcrumb style={{ margin: '16px 0' }}>
            {location.pathname.split("/").map((path, index, array) => (
              <Breadcrumb.Item key={path}>
                {index === 0 ? path : <Link to={`/${path}`}>{path}</Link>}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet style={{ flexGrow: 1 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center", backgroundColor: "#E3F2EE" }}>
          FastFoodDelivery ©{new Date().getFullYear()} Created by FireGroup
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;