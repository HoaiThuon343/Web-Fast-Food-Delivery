// using AutoMapper;
// using Business_Layer.Repositories;
// using Business_Layer.Services.VNPay;
// using Data_Layer.Models;
// using Data_Layer.ResourceModel.Common;
// using Data_Layer.ResourceModel.ViewModel.Enum;
// using Data_Layer.ResourceModel.ViewModel.OrderVMs;
// using Data_Layer.ResourceModel.ViewModel.User;
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;

// namespace Business_Layer.Services
// {
//     public class OrderService : IOrderService
//     {
//         private readonly IMapper _mapper;
//         private readonly IOrderRepository _orderRepository;
//         private readonly IOrderDetailRepository _orderDetailRepository;
//         private readonly IMenuFoodItem1Repository _menuFoodItem1Repository;
//         private readonly IUserService _userService;
//         private readonly IVNPayService _vNPayService;
//         private readonly IUserRepository _userRepository;

//         public OrderService(
//             IMapper mapper,
//             IOrderRepository orderRepository,
//             IOrderDetailRepository orderDetailRepository,
//             IMenuFoodItem1Repository menuFoodItem1Repository,
//             IVNPayService vNPayService,
//             IUserService userService,
//             IUserRepository userRepository)
//         {
//             _mapper = mapper;
//             _orderRepository = orderRepository;
//             _orderDetailRepository = orderDetailRepository;
//             _menuFoodItem1Repository = menuFoodItem1Repository;
//             _vNPayService = vNPayService;
//             _userService = userService;
//             _userRepository = userRepository;
//         }

//         // 1. Hủy đơn hàng (Dành cho User/Admin)
//         public async Task<APIResponseModel> CancelOrderAsync(Guid id)
//         {
//             var response = new APIResponseModel();
//             try
//             {
//                 var orderChecked = await _orderRepository.GetByIdAsync(id);

//                 if (orderChecked == null)
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Order not found";
//                     return response;
//                 }

//                 if (orderChecked.StatusOrder == "Cancelled")
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Order already cancelled";
//                     return response;
//                 }

//                 if (orderChecked.StatusOrder == "Confirmed")
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Order is confirmed and cannot be cancelled";
//                     return response;
//                 }

//                 // Thực hiện hủy
//                 orderChecked.StatusOrder = "Cancelled";
//                 // Nếu muốn hủy luôn trạng thái giao hàng
//                 orderChecked.DeliveryStatus = DeliveryStatusEnum.Cancelled.ToString();

//                 if (await _orderRepository.SaveAsync() > 0)
//                 {
//                     response.Data = _mapper.Map<OrderViewVM>(orderChecked);
//                     response.IsSuccess = true;
//                     response.message = "Order cancelled successfully";
//                 }
//                 else
//                 {
//                     response.Data = _mapper.Map<OrderViewVM>(orderChecked);
//                     response.IsSuccess = false;
//                     response.message = "Failed to cancel order";
//                 }
//             }
//             catch (Exception e)
//             {
//                 response.IsSuccess = false;
//                 response.message = $"Cancel order failed! Exception: {e.Message}";
//             }

//             return response;
//         }

//         // 2. Xác nhận đã nhận hàng (Dành cho User)
//         public async Task<APIResponseModel> ConfirmOrderForUserAsync(Guid Id)
//         {
//             var response = new APIResponseModel();
//             try
//             {
//                 var orderChecked = await _orderRepository.GetByIdAsync(Id);
//                 if (orderChecked == null)
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Order not found";
//                     return response;
//                 }

//                 if (orderChecked.DeliveryStatus == DeliveryStatusEnum.Received.ToString())
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Bill is already received";
//                     return response;
//                 }

//                 orderChecked.DeliveryStatus = DeliveryStatusEnum.Received.ToString();

//                 if (await _orderRepository.SaveAsync() > 0)
//                 {
//                     response.Data = _mapper.Map<OrderViewVM>(orderChecked);
//                     response.IsSuccess = true;
//                     response.message = "Order marked as received successfully";
//                 }
//                 else
//                 {
//                     response.Data = _mapper.Map<OrderViewVM>(orderChecked);
//                     response.IsSuccess = false;
//                     response.message = "Failed to update order status";
//                 }
//             }
//             catch (Exception ex)
//             {
//                 response.IsSuccess = false;
//                 response.message = $"Confirm order for user failed! Exception: {ex.Message}";
//             }
//             return response;
//         }

//         // 3. Tạo đơn hàng (Quan trọng cho thanh toán)
//         public async Task<APIResponseModel> CreateOrderAsync(OrderCreateVM createdto)
//         {
//             var response = new APIResponseModel();

//             try
//             {
//                 // Lấy thông tin khách hàng
//                 var customer = await _userService.GetUserById(createdto.MemberId);
//                 if (customer == null)
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Member not found";
//                     return response;
//                 }

//                 var orderentity = _mapper.Map<Data_Layer.Models.Order>(createdto);
//                 orderentity.StatusOrder = "Pending"; // Mới tạo thì là Pending
//                 orderentity.Address = customer.Address;
//                 orderentity.DeliveryStatus = DeliveryStatusEnum.Processing.ToString();

//                 await _orderRepository.AddAsync(orderentity);

//                 if (await _orderRepository.SaveAsync() > 0)
//                 {
//                     // Tạo link thanh toán VNPAY
//                     var paymentUrl = await _vNPayService.CreatePaymentRequestAsync(orderentity.OrderId);
//                     if (!string.IsNullOrEmpty(paymentUrl))
//                     {
//                         response.Data = _mapper.Map<OrderViewVM>(orderentity);
//                         response.IsSuccess = true;
//                         response.message = paymentUrl; // Trả về link thanh toán
//                     }
//                     else
//                     {
//                         response.IsSuccess = false;
//                         response.message = "Payment failed.";
//                     }
//                     return response;
//                 }

//                 response.IsSuccess = false;
//                 response.message = "Failed to create order";
//             }
//             catch (Exception ex)
//             {
//                 response.IsSuccess = false;
//                 response.message = $"Create order failed! Exception: {ex.Message}";
//             }

//             return response;
//         }

//         // 4. Lấy chi tiết 1 đơn hàng
//         public async Task<APIResponseModel> GetOrderByIdAsync(Guid orderId)
//         {
//             var response = new APIResponseModel();
//             try
//             {
//                 var order = await _orderRepository.GetByIdAsync(orderId, x => x.User);
//                 if (order == null)
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Order not found";
//                     return response;
//                 }

//                 var mapper = _mapper.Map<OrderViewVM>(order);
//                 mapper.MemberName = order.User?.UserName;
//                 mapper.PhoneNumber = order.User?.PhoneNumber;

//                 response.Data = mapper;
//                 response.IsSuccess = true;
//                 response.message = "Order retrieved successfully";
//             }
//             catch (Exception ex)
//             {
//                 response.IsSuccess = false;
//                 response.message = ex.Message;
//             }

//             return response;
//         }

//         // 5. Lấy đơn hàng của 1 User cụ thể
//         public async Task<APIResponseModel> GetOrderByUserIDAsync(Guid userId)
//         {
//             var response = new APIResponseModel();
//             var orderDTOs = new List<OrderViewVM>();
//             try
//             {
//                 var orders = (await _orderRepository.GetAllOrderByUserIdAsync(userId.ToString())).ToList();
//                 var user = await _userService.GetUserById(userId.ToString());

//                 foreach (var order in orders)
//                 {
//                     var mapper = _mapper.Map<OrderViewVM>(order);
//                     mapper.MemberName = user?.FullName;
//                     mapper.PhoneNumber = user?.PhoneNumber;
//                     orderDTOs.Add(mapper);
//                 }

//                 if (orderDTOs.Count > 0)
//                 {
//                     response.Data = orderDTOs;
//                     response.IsSuccess = true;
//                     response.message = $"Have {orderDTOs.Count} order.";
//                 }
//                 else
//                 {
//                     response.IsSuccess = false;
//                     response.message = "No orders found for this user";
//                 }

//                 return response;
//             }
//             catch (Exception ex)
//             {
//                 response.IsSuccess = false;
//                 response.message = $"GetOrderByUserID failed! Exception: {ex.Message}";
//                 return response;
//             }
//         }

//         // 6. Lấy TẤT CẢ đơn hàng (Cho Admin/Restaurant)
//         public async Task<APIResponseModel> GetOrdersAsync()
//         {
//             var response = new APIResponseModel();
//             var orderDTOs = new List<OrderViewVM>();
//             try
//             {
//                 var orders = await _orderRepository.GetAllAsync(x => x.User);
//                 foreach (var order in orders)
//                 {
//                     var mapper = _mapper.Map<OrderViewVM>(order);
//                     mapper.MemberName = order.User?.UserName;
//                     mapper.PhoneNumber = order.User?.PhoneNumber;
//                     orderDTOs.Add(mapper);
//                 }

//                 response.Data = orderDTOs;
//                 response.IsSuccess = orderDTOs.Count > 0;
//                 response.message = orderDTOs.Count > 0 ? $"Have {orderDTOs.Count} order." : "No orders found";

//                 return response;
//             }
//             catch (Exception ex)
//             {
//                 response.IsSuccess = false;
//                 response.message = ex.Message;
//                 return response;
//             }
//         }

//         public Task<APIResponseModel> GetSortedOrdersAsync(string sortName)
//         {
//             throw new NotImplementedException();
//         }

//         // 7. Cập nhật thông tin đơn hàng (Admin dùng)
//         public async Task<APIResponseModel> UpdateOrderAsync(Guid id, OrderUpdateVM updatedto)
//         {
//             var response = new APIResponseModel();
//             try
//             {
//                 var orderChecked = await _orderRepository.GetByIdAsync(id);

//                 if (orderChecked == null)
//                 {
//                     response.IsSuccess = false;
//                     response.message = "Order not found";
//                     return response;
//                 }

//                 // Map dữ liệu mới vào entity cũ
//                 _mapper.Map(updatedto, orderChecked);

//                 if (await _orderRepository.SaveAsync() > 0)
//                 {
//                     response.Data = _mapper.Map<OrderViewVM>(orderChecked);
//                     response.IsSuccess = true;
//                     response.message = "Order updated successfully";
//                 }
//                 else
//                 {
//                     response.Data = _mapper.Map<OrderViewVM>(orderChecked);
//                     response.IsSuccess = false;
//                     response.message = "Failed to update order";
//                 }
//             }
//             catch (Exception e)
//             {
//                 response.IsSuccess = false;
//                 response.message = $"Update order failed! Exception: {e.Message}";
//             }

//             return response;
//         }
//     }
// }



using AutoMapper;
using Business_Layer.Repositories;
using Business_Layer.Services.VNPay;
using Data_Layer.Models;
using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel.Enum;
using Data_Layer.ResourceModel.ViewModel.OrderVMs;
using Data_Layer.ResourceModel.ViewModel.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Business_Layer.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IMenuFoodItem1Repository _menuFoodItem1Repository;
        private readonly IUserService _userService;
        private readonly IVNPayService _vNPayService;
        private readonly IUserRepository _userRepository;

        public OrderService(
            IMapper mapper,
            IOrderRepository orderRepository,
            IOrderDetailRepository orderDetailRepository,
            IMenuFoodItem1Repository menuFoodItem1Repository,
            IVNPayService vNPayService,
            IUserService userService,
            IUserRepository userRepository)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _menuFoodItem1Repository = menuFoodItem1Repository;
            _vNPayService = vNPayService;
            _userService = userService;
            _userRepository = userRepository;
        }

        public async Task<APIResponseModel> CancelOrderAsync(Guid id)
        {
            var response = new APIResponseModel();
            try
            {
                var orderChecked = await _orderRepository.GetByIdAsync(id);

                if (orderChecked == null)
                {
                    response.IsSuccess = false;
                    response.message = "Order not found";
                    return response;
                }

                if (orderChecked.StatusOrder == "Cancelled")
                {
                    response.IsSuccess = false;
                    response.message = "Order already cancelled";
                    return response;
                }

                if (orderChecked.StatusOrder == "Confirmed")
                {
                    response.IsSuccess = false;
                    response.message = "Order is confirmed and cannot be cancelled";
                    return response;
                }

                orderChecked.StatusOrder = "Cancelled";
                // Nếu bạn muốn cập nhật cả DeliveryStatus khi hủy
                orderChecked.DeliveryStatus = DeliveryStatusEnum.Cancelled.ToString(); 

                if (await _orderRepository.SaveAsync() > 0)
                {
                    response.Data = _mapper.Map<OrderViewVM>(orderChecked);
                    response.IsSuccess = true;
                    response.message = "Order cancelled successfully";
                }
                else
                {
                    response.Data = _mapper.Map<OrderViewVM>(orderChecked);
                    response.IsSuccess = false;
                    response.message = "Failed to cancel order";
                }
            }
            catch (Exception e)
            {
                response.IsSuccess = false;
                response.message = $"Cancel order failed! Exception: {e.Message}";
            }

            return response;
        }

        // Đã xóa CancelOrderForShipperAsync

        // 2. Xác nhận đã nhận hàng (Dành cho User khi Drone giao xong)
        public async Task<APIResponseModel> ConfirmOrderForUserAsync(Guid Id)
        {
            var response = new APIResponseModel();
            try
            {
                var orderChecked = await _orderRepository.GetByIdAsync(Id);
                if (orderChecked == null)
                {
                    response.IsSuccess = false;
                    response.message = "Order not found";
                    return response;
                }

                // Sửa điều kiện kiểm tra logic mới
                if (orderChecked.StatusOrder == "Delivered") 
                {
                    response.IsSuccess = false;
                    response.message = "Bill is already received";
                    return response;
                }

                // Cập nhật cả 2 trạng thái cho chắc chắn
                orderChecked.StatusOrder = "Delivered"; 
                orderChecked.DeliveryStatus = "Received"; // Giữ lại để tương thích

                if (await _orderRepository.SaveAsync() > 0)
                {
                    response.Data = _mapper.Map<OrderViewVM>(orderChecked);
                    response.IsSuccess = true;
                    response.message = "Order marked as received successfully";
                }
                else
                {
                    response.Data = _mapper.Map<OrderViewVM>(orderChecked);
                    response.IsSuccess = false;
                    response.message = "Failed to update order status";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.message = $"Confirm order for user failed! Exception: {ex.Message}";
            }
            return response;
        }
        public async Task<APIResponseModel> CreateOrderAsync(OrderCreateVM createdto)
        {
            var response = new APIResponseModel();

            try
            {
                var customer = await _userService.GetUserById(createdto.MemberId);
                if (customer == null)
                {
                    response.IsSuccess = false;
                    response.message = "Member not found";
                    return response;
                }

                var orderentity = _mapper.Map<Data_Layer.Models.Order>(createdto);
                orderentity.StatusOrder = "Pending";
                orderentity.Address = customer.Address;
                orderentity.DeliveryStatus = DeliveryStatusEnum.Processing.ToString();

                await _orderRepository.AddAsync(orderentity);

                if (await _orderRepository.SaveAsync() > 0)
                {
                    var paymentUrl = await _vNPayService.CreatePaymentRequestAsync(orderentity.OrderId);
                    if (!string.IsNullOrEmpty(paymentUrl))
                    {
                        response.Data = _mapper.Map<OrderViewVM>(orderentity);
                        response.IsSuccess = true;
                        response.message = paymentUrl;
                    }
                    else
                    {
                        response.IsSuccess = false;
                        response.message = "Payment failed.";
                    }
                    return response;
                }

                response.IsSuccess = false;
                response.message = "Failed to create order";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.message = $"Create order failed! Exception: {ex.Message}";
            }

            return response;
        }

        // public async Task<APIResponseModel> GetOrderByIdAsync(Guid orderId)
        // {
        //     var response = new APIResponseModel();
        //     try
        //     {
        //         var order = await _orderRepository.GetByIdAsync(orderId, x => x.User);
        //         if (order == null)
        //         {
        //             response.IsSuccess = false;
        //             response.message = "Order not found";
        //             return response;
        //         }

        //         var mapper = _mapper.Map<OrderViewVM>(order);
        //         mapper.MemberName = order.User?.UserName;
        //         mapper.PhoneNumber = order.User?.PhoneNumber;

        //         response.Data = mapper;
        //         response.IsSuccess = true;
        //         response.message = "Order retrieved successfully";
        //     }
        //     catch (Exception ex)
        //     {
        //         response.IsSuccess = false;
        //         response.message = ex.Message;
        //     }

        //     return response;
        // }

        // 4. Lấy chi tiết 1 đơn hàng
        public async Task<APIResponseModel> GetOrderByIdAsync(Guid orderId)
        {
            var response = new APIResponseModel();
            try
            {
                // --- SỬA DÒNG NÀY ---
                // Cũ: var order = await _orderRepository.GetByIdAsync(orderId, x => x.User);
                
                // Mới: Thêm "x => x.OrderDetails" để lấy kèm danh sách món ăn
                var order = await _orderRepository.GetByIdAsync(orderId, x => x.User, x => x.OrderDetails);
                // --------------------

                if (order == null)
                {
                    response.IsSuccess = false;
                    response.message = "Order not found";
                    return response;
                }

                var mapper = _mapper.Map<OrderViewVM>(order);
                mapper.MemberName = order.User?.UserName;
                mapper.PhoneNumber = order.User?.PhoneNumber;

                response.Data = mapper;
                response.IsSuccess = true;
                response.message = "Order retrieved successfully";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.message = ex.Message;
            }

            return response;
        }

        public async Task<APIResponseModel> GetOrderByUserIDAsync(Guid userId)
        {
            var response = new APIResponseModel();
            var orderDTOs = new List<OrderViewVM>();
            try
            {
                var orders = (await _orderRepository.GetAllOrderByUserIdAsync(userId.ToString())).ToList();
                var user = await _userService.GetUserById(userId.ToString());

                foreach (var order in orders)
                {
                    var mapper = _mapper.Map<OrderViewVM>(order);
                    mapper.MemberName = user?.FullName;
                    mapper.PhoneNumber = user?.PhoneNumber;
                    orderDTOs.Add(mapper);
                }

                if (orderDTOs.Count > 0)
                {
                    response.Data = orderDTOs;
                    response.IsSuccess = true;
                    response.message = $"Have {orderDTOs.Count} order.";
                }
                else
                {
                    response.IsSuccess = false;
                    response.message = "No orders found for this user";
                }

                return response;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.message = $"GetOrderByUserID failed! Exception: {ex.Message}";
                return response;
            }
        }

        public async Task<APIResponseModel> GetOrdersAsync()
        {
            var response = new APIResponseModel();
            var orderDTOs = new List<OrderViewVM>();
            try
            {
                var orders = await _orderRepository.GetAllAsync(x => x.User);
                foreach (var order in orders)
                {
                    var mapper = _mapper.Map<OrderViewVM>(order);
                    mapper.MemberName = order.User?.UserName;
                    mapper.PhoneNumber = order.User?.PhoneNumber;
                    orderDTOs.Add(mapper);
                }

                response.Data = orderDTOs;
                response.IsSuccess = orderDTOs.Count > 0;
                response.message = orderDTOs.Count > 0 ? $"Have {orderDTOs.Count} order." : "No orders found";

                return response;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.message = ex.Message;
                return response;
            }
        }

        // Đã xóa GetOrdersAsyncForShipper
        // Đã xóa GetOrdersAsyncOfShipper

        public Task<APIResponseModel> GetSortedOrdersAsync(string sortName)
        {
            throw new NotImplementedException();
        }

        // 7. Cập nhật thông tin đơn hàng (Admin/Restaurant dùng)
        public async Task<APIResponseModel> UpdateOrderAsync(Guid id, OrderUpdateVM updatedto)
        {
            var response = new APIResponseModel();
            try
            {
                // --- SỬA QUAN TRỌNG 1: Lấy đơn hàng KÈM THEO thông tin User ---
                // Nếu không có "x => x.User", kết quả trả về sẽ không có tên khách hàng
                var orderChecked = await _orderRepository.GetByIdAsync(id, x => x.User, x => x.OrderDetails);

                if (orderChecked == null)
                {
                    response.IsSuccess = false;
                    response.message = "Order not found";
                    return response;
                }

                // --- SỬA QUAN TRỌNG 2: Chỉ cập nhật Status, GIỮ NGUYÊN cái khác ---
                // Tuyệt đối KHÔNG dùng: _mapper.Map(updatedto, orderChecked); 
                
                if (!string.IsNullOrEmpty(updatedto.StatusOrder))
                {
                    orderChecked.StatusOrder = updatedto.StatusOrder;
                }

                // Cập nhật vào Database
                if (await _orderRepository.SaveAsync() > 0)
                {
                    // Map ngược lại để trả về frontend hiển thị
                    // Lúc này orderChecked đã có đủ User và OrderDetails nhờ bước 1
                    var viewData = _mapper.Map<OrderViewVM>(orderChecked);
                    
                    // Đảm bảo tên khách hàng được map đúng
                    viewData.MemberName = orderChecked.User?.UserName ?? orderChecked.User?.FullName;
                    viewData.PhoneNumber = orderChecked.User?.PhoneNumber;

                    response.Data = viewData;
                    response.IsSuccess = true;
                    response.message = "Order updated successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.message = "Failed to update order (No changes saved)";
                }
            }
            catch (Exception e)
            {
                response.IsSuccess = false;
                response.message = $"Update order failed! Exception: {e.Message}";
            }

            return response;
        }

        // Đã xóa UpdateOrderForShipperAsync
        // Đã xóa ConfirmOrderForShipperAsync
    }
}