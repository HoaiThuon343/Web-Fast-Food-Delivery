import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "./redux/features/userAccount";

// --- IMPORT COMPONENTS  ---
import Layout from "./components/layout";
import Category from "./pages/category-management";
import FoodItemManagement from "./pages/fastfood-magegement";
import HomePage from "./pages/home";
import Login from "./pages/login";
import PaymentFailure from "./pages/payment/paymentFail";
import PaymentSuccess from "./pages/payment/paymentSuccess";
import UserAccount from "./pages/profolio";
import Register from "./pages/register";
import ShoppingCart from "./pages/shoppingcart/ShoppingCart";
import UserFeedback from "././pages/feedback/UserFeedback";
import RestaurantAccountManagement from "./pages/accountuser-management/RestaurantAccountManagement";
//import AddShipper from "./pages/accountuser-management/AddRestaurant";
import AdminAccountManagement from "./pages/accountuser-management/AdminAccountManagement";
import OrderAdmin from "./pages/orderAdmin";
import Report from "./pages/report";
import ReportRevenue from "./pages/reportRevenue";
import ViewOrderHistory from "./pages/accountuser-management/ViewOrderHistory";
import ViewShipperOrders from "./pages/accountuser-management/ViewShipperOrders";
import ViewAllFeedback from "./pages/accountuser-management/ViewAllFeedBack";
import TrackingPage from "./pages/tracking";
import PaymentConfirmation from "./pages/payment/PaymentConfirmation";
// Thêm dòng này vào nhóm import các page
import MomoPayment from "./pages/payment/MomoPayment";

// Đổi tên Dashboard cũ thành AdminDashboard để tránh trùng tên
import AdminDashboard from "./pages/dashboard-management"; 
import DroneManagement from './pages/drone-management'; 

// --- IMPORT COMPONENTS NHÀ HÀNG (MỚI) ---
import RestaurantLayout from './layouts/RestaurantLayout';
import DronePage from './pages/restaurant/DronePage';
// Đổi tên Dashboard mới thành RestDashboard
import RestDashboard from './pages/restaurant/Dashboard'; 
import FoodPage from './pages/restaurant/FoodPage';
import RestaurantOrderPage from './pages/restaurant/RestaurantOrderPage';
//import AddRestaurant from "./pages/accountuser-management/AddRestaurant";
import AddRestaurant from './pages/restaurant/AddRestaurant';
import Settings from './pages/restaurant/Settings';

// Tạo component Placeholder để giữ chỗ các trang chưa làm
const Placeholder = ({ title }) => (
  <h2 style={{ textAlign: 'center', marginTop: 50 }}>{title} (Đang phát triển)</h2>
);

function App() {
  // Hàm kiểm tra quyền Admin/User/Shipper
  const AdminRoute = ({ children, role }) => {
    const user = useSelector((store) => store.account);
    const dispatch = useDispatch();
    if (user?.role === role) {
      return children;
    } else {
      toast.error("Access Denied");
      dispatch(logout());
      return <Navigate to="/login" />;
    }
  };

  const router = createBrowserRouter([
    // ================== 1. GIAO DIỆN KHÁCH HÀNG (CUSTOMER) ==================
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/view-feedback", element: <UserFeedback /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/tracking", element: <TrackingPage /> },
        { path: "/shoppingcart", element: <ShoppingCart /> },
        {
          path: "/payment-confirmation",
          element: <PaymentConfirmation />,
        },
        {
          path: "/payment-momo",
          element: <MomoPayment />,
        },
        { path: "/paymentSuccess", element: <PaymentSuccess /> },
        { path: "/paymentFail", element: <PaymentFailure /> },
        { path: "/profolio", element: <UserAccount /> },
        {
          path: "/viewOrderHistory",
          element: (
            <AdminRoute role="User">
              <ViewOrderHistory />
            </AdminRoute>
          ),
        },
        {
          path: "/viewshipperOrders",
          element: (
            <AdminRoute role="Shipper">
              <ViewShipperOrders />
            </AdminRoute>
          ),
        },
        
      ],
    },

    // ================== 2. GIAO DIỆN ADMIN (QUẢN TRỊ VIÊN) ==================
    {
      path: "/dashboard",
      element: (
        <AdminRoute role="Admin">
          <AdminDashboard />
        </AdminRoute>
      ),
      children: [
        { path: "/dashboard/category", element: <Category /> },
        { path: "/dashboard/dronemanagement", element: <DroneManagement /> },
        { path: "/dashboard/MenuFoodItem", element: <FoodItemManagement /> },
        { path: "/dashboard/OrderAdmin", element: <OrderAdmin /> },
        { path: "/dashboard/viewallfeedback", element: <ViewAllFeedback /> },
        { path: "/dashboard/accounts", element: <AdminAccountManagement /> },
        { path: "/dashboard/restaurant", element: <RestaurantAccountManagement /> },
        { path: "addrestaurant", element: <AddRestaurant />},
        { path: "/dashboard/report", element: <Report /> },
        { path: "/dashboard/reportrevenue", element: <ReportRevenue /> },
      ],
    },

    // ================== 3. GIAO DIỆN NHÀ HÀNG (RESTAURANT - MỚI) ==================
    // Đây là phần bạn cần thêm, đặt ngang hàng với "/" và "/dashboard"
    {
      path: "/restaurant",
        element: (
            <AdminRoute role="Restaurant">
              <RestaurantLayout />
            </AdminRoute>
        ),
      children: [
        { 
          index: true, 
          element: <Navigate to="drone" /> // Mặc định vào trang Drone
        },
        { 
          path: "drone", 
          element: <DronePage /> 
        },
        { 
          path: "dashboard", 
          element: <RestDashboard /> 
        },
        { 
          path: "menu", 
          element: <FoodPage /> 
        },
        { 
          path: "orders", 
          //element: <Placeholder title="Danh sách đơn hàng" /> 
          element: <RestaurantOrderPage />
        },
        
        { 
          path: "withdraw", 
          element: <Placeholder title="Rút tiền" /> 
        },
        { 
          path: "settings", 
          element: <Settings /> 
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;