import React, { useState, useEffect } from "react";
import { Button, notification } from "antd"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Đổi tên component cho rõ ràng hơn (nếu bạn vẫn dùng ShipperAccountManagement thì giữ nguyên tên cũ)
function RestaurantAccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();

    // Hàm gọi API lấy danh sách nhà hàng
    const fetchRestaurants = async () => {
        try {
            const response = await axios.get("http://localhost:5213/api/Restaurant/get-all");
            // Kiểm tra xem data trả về có đúng cấu trúc { isSuccess: true, data: [...] } không
            if (response.data.isSuccess && response.data.data) {
                setAccounts(response.data.data);
            } else {
                setAccounts([]); // Đảm bảo clear nếu không có data
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
            notification.error({ message: "Lỗi tải dữ liệu", description: "Không thể kết nối đến Backend." });
        }
    };

    // Hàm xử lý xóa (Admin)
    const handleDeleteRestaurant = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa nhà hàng này?")) return;

        try {
            // Gọi API Delete mới có ràng buộc
            const response = await axios.delete(`http://localhost:5213/api/Restaurant/delete/${id}`);
            
            if (response.status === 200) {
                notification.success({ message: "Xóa thành công!" });
                fetchRestaurants(); // Tải lại danh sách
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi hệ thống hoặc nhà hàng đang có đơn hàng.";
            notification.error({ message: "Xóa thất bại", description: msg });
        }
    };
    
    // Tải dữ liệu khi component được mount
    useEffect(() => {
        fetchRestaurants();
    }, []);

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Quản lý Nhà Hàng</h2>
                <Button type="primary" onClick={() => navigate("/dashboard/addrestaurant")}>
                    THÊM NHÀ HÀNG MỚI
                </Button>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Tên nhà hàng</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th> {/* <--- ĐÃ THÊM TIÊU ĐỀ CỘT ACTIONS */}
                    </tr>
                </thead>

                <tbody>
                    {accounts.length === 0 ? (
                        <tr><td colSpan="6" className="text-center">Chưa có nhà hàng nào</td></tr>
                    ) : (
                        accounts.map((acc) => (
                            <tr key={acc.id}>
                                <td>{acc.fullName}</td>
                                <td>{acc.email}</td>
                                <td>{acc.phoneNumber}</td>
                                <td>{acc.address}</td>
                                <td>
                                    {/* Sử dụng span/Badge cho trạng thái */}
                                    {acc.status === "Active" ? (
                                        <span className="badge bg-success">Hoạt động</span>
                                    ) : (
                                        <span className="badge bg-danger">Bị khóa</span>
                                    )}
                                </td>
                                <td> {/* <--- CỘT ACTIONS */}
                                    <Button 
                                        type="primary" 
                                        danger // Màu đỏ
                                        size="small"
                                        onClick={() => handleDeleteRestaurant(acc.id)}
                                    >
                                        DELETE
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RestaurantAccountManagement;