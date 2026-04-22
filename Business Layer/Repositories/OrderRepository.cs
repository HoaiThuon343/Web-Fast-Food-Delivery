using Business_Layer.DataAccess;
using Data_Layer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Business_Layer.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly FastFoodDeliveryDBContext _dbContext;
        public OrderRepository(FastFoodDeliveryDBContext context) : base(context)
        {
            _dbContext = context;
        }
        public async Task<IEnumerable<Order>> GetAllByStatusAsync(string status)
        {
            var Orders = await _dbContext.Orders.Where(o => o.StatusOrder.ToLower() == status.ToLower()).ToListAsync();
            if (Orders.Any() == false)
            {
                throw new Exception("User haven't Order");
            }
            return Orders;
        }

        public async Task<IEnumerable<Order>> GetAllOrderByUserIdAsync(string memberID)
        {
            var Orders = await _dbContext.Orders.Where(o => o.MemberId == memberID).ToListAsync();
            if (Orders.Any() == false)
            {
                throw new Exception("User haven't Order");
            }
            return Orders;

        }

        public async Task<IEnumerable<Order>> GetConfirmedOrders()
        {
            var orders = await _dbContext.Orders.ToListAsync();
            var confirmedOrders = orders.Where(o => o.StatusOrder == "Paid");
            return confirmedOrders.ToList();
        }

        // --- HÀM MỚI (Đã sửa lỗi tham chiếu context) ---
        public async Task<bool> CheckActiveOrdersByRestaurantId(string restaurantId)
        {
            // Các trạng thái được coi là đang hoạt động (chưa Complete)
            var activeStatus = new List<string> { "Pending", "Processing", "Delivering" }; 

            // Kiểm tra đơn hàng có status đang hoạt động và thuộc về nhà hàng này
            var hasActiveOrders = await _dbContext.Orders 
                .AnyAsync(o => o.MemberId == restaurantId && activeStatus.Contains(o.StatusOrder)); 

            return hasActiveOrders;
        }
    }
}
