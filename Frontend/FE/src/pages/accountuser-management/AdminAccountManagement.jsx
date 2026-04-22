import React, { useState, useEffect } from "react";
import { Table, Button, Form, Badge } from "react-bootstrap"; // Dùng Bootstrap thuần
import { useNavigate } from "react-router-dom";
import useAdminAccountManagement from "../../utils/useAdminAccountManagement";
import axios from "axios";
import { notification } from "antd"; // Chỉ dùng antd cho thông báo đẹp

function AdminAccountManagement() {
  // Lấy các hàm và data từ custom hook
  // Lưu ý: Cần đảm bảo useAdminAccountManagement có trả về hàm fetchAccount để gọi lại khi update xong
  const { accounts, handleDisable, fetchAccount } = useAdminAccountManagement(); 
  
  const [roleFilter, setRoleFilter] = useState("");
  const navigate = useNavigate();

  const filteredAccounts = roleFilter
    ? accounts.filter((account) => account.role === roleFilter)
    : accounts;

  // 1. HÀM MỞ KHÓA TÀI KHOẢN
  // 1. HÀM MỞ KHÓA TÀI KHOẢN (Đã sửa lỗi 400)
 const handleUnlock = async (record) => {
    try {
      console.log("Dữ liệu record:", record);

      // Payload phải khớp với UserUpdateViewModel trong Backend
      const payload = {
        fullName: record.fullName || "Updated Name",
        email: record.email, // Email thường bắt buộc và không được null
        
        // Nếu phone null thì gửi chuỗi rỗng hoặc số mặc định hợp lệ (tùy backend validate)
        // Tốt nhất là gửi đúng số đang có, nếu không có thì bỏ qua hoặc gửi string rỗng
        phoneNumber: record.phoneNumber || "", 
        
        address: record.address || "",
      };

      console.log("Payload gửi đi:", payload);

      // Lưu ý: API có thể yêu cầu query params ID và Body cùng lúc
      const response = await axios.put(
        `http://localhost:5213/api/User/UpdateUser?id=${record.id}`, 
        payload
      );

      if (response.data.IsSuccess || response.status === 200) {
        notification.success({ message: "Thành công", description: "Đã mở khóa tài khoản!" });
        
        if (typeof fetchAccount === 'function') {
             fetchAccount();
        } else {
             window.location.reload();
        }
      } else {
        // In lỗi backend trả về để debug
        console.error("Backend Error:", response.data);
        notification.error({ 
            message: "Lỗi Backend", 
            description: response.data.message || "Không thể mở khóa." 
        });
      }
    } catch (error) {
      console.error("Lỗi Unlock:", error.response?.data);
      const serverMsg = error.response?.data?.message || error.response?.data?.title || "Lỗi hệ thống.";
      
      // Hiển thị lỗi chi tiết ra màn hình để bạn biết sai ở đâu (Validation)
      if(error.response?.data?.errors) {
          const validationErrors = JSON.stringify(error.response.data.errors);
          notification.error({ message: "Lỗi Dữ liệu", description: validationErrors });
      } else {
          notification.error({ message: "Lỗi 400", description: JSON.stringify(serverMsg) });
      }
    }
  };

  return (
    <div className="container mt-3">
      <h2>Account Management</h2>
      
      <Form.Group controlId="roleFilter" className="mb-3">
        <Form.Label>Filter by Role</Form.Label>
        <Form.Control
          as="select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </Form.Control>
      </Form.Group>

      <div className="mb-3">
        <Button
          variant="primary"
          className="me-2"
          onClick={() => navigate("/dashboard/shipper")} // Hoặc link mới restaurant nếu đã đổi
        >
          Manage Restaurant Account
        </Button>
        <Button variant="info" onClick={() => navigate("/view-feedback")}>
          View Feedback
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No accounts found</td>
            </tr>
          ) : (
            filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.fullName}</td>
                <td>{account.email}</td>
                <td>
                    <Badge bg={account.role === 'Admin' ? 'danger' : 'primary'}>
                        {account.role}
                    </Badge>
                </td>
                <td>{account.phoneNumber}</td>
                <td>{account.address}</td>
                <td>
                    {/* Hiển thị Status có màu sắc */}
                    {account.status === 'IsDeleted' ? (
                        <Badge bg="danger">Deleted</Badge>
                    ) : (
                        <Badge bg="success">Active</Badge>
                    )}
                </td>
                <td>
                  {/* LOGIC NÚT BẤM: Nếu đã xóa -> Hiện nút Mở khóa. Nếu chưa -> Hiện nút Xóa */}
                  {account.status === 'IsDeleted' ? (
                      <Button
                        variant="success" // Màu xanh lá
                        size="sm"
                        onClick={() => handleUnlock(account)}
                      >
                        Unlock
                      </Button>
                  ) : (
                      <Button
                        variant="danger" // Màu đỏ
                        size="sm"
                        onClick={() => handleDisable(account.id)}
                      >
                        Disable
                      </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminAccountManagement;