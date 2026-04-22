using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel;
using Data_Layer.ResourceModel.ViewModel.Enum;
using Data_Layer.ResourceModel.ViewModel.OrderDetailVMs;
using Data_Layer.ResourceModel.ViewModel.OrderVMs;
using System;
using System.Threading.Tasks;

namespace Business_Layer.Services
{
    public interface IOrderService
    {
        // Lấy tất cả đơn hàng (Admin)
        Task<APIResponseModel> GetOrdersAsync();

        // Lấy chi tiết đơn hàng
        Task<APIResponseModel> GetOrderByIdAsync(Guid orderId);

        // Lấy đơn hàng của User cụ thể
        Task<APIResponseModel> GetOrderByUserIDAsync(Guid userId);

        // Tạo đơn hàng mới
        Task<APIResponseModel> CreateOrderAsync(OrderCreateVM createdto);

        // Cập nhật đơn hàng (Admin)
        Task<APIResponseModel> UpdateOrderAsync(Guid id, OrderUpdateVM updatedto);

        // Hủy đơn hàng
        Task<APIResponseModel> CancelOrderAsync(Guid id);

        // Xác nhận đã nhận hàng (User)
        Task<APIResponseModel> ConfirmOrderForUserAsync(Guid Id);

        // Sắp xếp (nếu cần)
        Task<APIResponseModel> GetSortedOrdersAsync(string sortName);
    }
}