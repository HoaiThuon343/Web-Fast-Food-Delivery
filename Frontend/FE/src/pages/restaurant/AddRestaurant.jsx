import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";

// Gọi vào API Restaurant mới (Không dùng Shipper nữa)
const apiEndpoint = "http://localhost:5213/api/Restaurant/register"; 

function AddRestaurant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State lưu dữ liệu Form
  const [account, setAccount] = useState({
    fullName: "",    // Tên nhà hàng
    email: "",
    phoneNumber: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra mật khẩu khớp nhau
    if (account.password !== account.confirmPassword) {
      notification.error({ message: "Lỗi", description: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    setLoading(true);

    try {
      // 2. Chuẩn bị dữ liệu gửi đi (Payload)
      // Khớp chính xác với RegisterRestaurantModel bên Backend
      const payload = {
        fullName: account.fullName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        address: account.address,
        userName: account.username, // Lưu ý: Backend thường dùng UserName hoặc username (check lại Model)
        password: account.password,
        confirmPassword: account.confirmPassword
        // Không cần gửi Role, Backend tự xử lý
      };

      // 3. Gọi API
      const response = await axios.post(apiEndpoint, payload);

      // 4. Xử lý thành công
      // Kiểm tra cả status 200 và flag isSuccess nếu backend trả về
      if (response.status === 200) {
        notification.success({ message: "Thành công", description: "Đã tạo nhà hàng mới!" });
        
        // Đợi 1s rồi chuyển về trang danh sách
        setTimeout(() => {
             navigate("/dashboard/restaurant"); // Đường dẫn này phải khớp với routing của bạn
        }, 1000);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      
      let errorMsg = "Không thể kết nối đến Server.";
      
      // Xử lý hiển thị lỗi chi tiết từ Backend trả về
      if (error.response && error.response.data) {
          const data = error.response.data;
          
          if (data.message) errorMsg = data.message;
          else if (data.errors) {
              // Lấy lỗi đầu tiên trong danh sách lỗi validation
              const firstKey = Object.keys(data.errors)[0];
              if (firstKey) errorMsg = `${firstKey}: ${data.errors[firstKey][0]}`;
          } else if (data.title) {
              errorMsg = data.title;
          }
      }

      notification.error({ 
          message: "Thêm thất bại", 
          description: errorMsg 
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4 text-primary">Thêm Nhà Hàng Mới</h2>
      
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        
        {/* Phần 1: Thông tin cơ bản */}
        <h5 className="mb-3 text-secondary border-bottom pb-2">Thông tin nhà hàng</h5>
        <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tên nhà hàng <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={handleChange} required placeholder="VD: Gà Rán KFC" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email liên hệ <span className="text-danger">*</span></label>
              <input type="email" className="form-control" name="email" value={account.email} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Số điện thoại <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Địa chỉ <span className="text-danger">*</span></label>
              <input type="text" className="form-control" name="address" value={account.address} onChange={handleChange} required />
            </div>
        </div>

        {/* Phần 2: Tài khoản đăng nhập */}
        <h5 className="mb-3 text-secondary border-bottom pb-2 mt-3">Tài khoản quản trị</h5>
        <div className="mb-3">
          <label className="form-label">Tên đăng nhập (Username) <span className="text-danger">*</span></label>
          <input type="text" className="form-control" name="username" value={account.username} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
            <input type="password" className="form-control" name="password" value={account.password} onChange={handleChange} required placeholder="Ít nhất 6 ký tự" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Xác nhận mật khẩu <span className="text-danger">*</span></label>
            <input type="password" className="form-control" name="confirmPassword" value={account.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        {/* Nút bấm */}
        <div className="d-flex justify-content-end mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={() => navigate("/dashboard/restaurant")} disabled={loading}>
                Quay lại
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Đang xử lý..." : "Lưu Nhà Hàng"}
            </button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurant;