// using Business_Layer.DataAccess;
// using Data_Layer.Models;
// using Data_Layer.ResourceModel.Common;
// using Data_Layer.ResourceModel.ViewModel.DroneVMs;
// using Microsoft.EntityFrameworkCore;

// namespace Business_Layer.Services
// {
//     public class DroneService : IDroneService
//     {
//         private readonly FastFoodDeliveryDBContext _context;

//         public DroneService(FastFoodDeliveryDBContext context)
//         {
//             _context = context;
//         }

//         // Lấy danh sách Drone (phục vụ Admin)
//         public async Task<APIResponseModel> GetAllDronesAsync()
//         {
//             var drones = await _context.Drones.ToListAsync();
//             return new APIResponseModel
//             {
//                 code = 200,
//                 message = "Danh sách Drone đã lấy thành công.",
//                 Data = drones,
//                 IsSuccess = true
//             };
//         }

//         // Thêm Drone mới
//         public async Task<APIResponseModel> AddDroneAsync(DroneCreateVM model)
//         {
//             var drone = new Drone
//             {
//                 Name = model.NameDrone,
//                 Model = model.Model,
//                 BatteryLevel = 100, // Mặc định pin 100% khi thêm mới
//                 Status = "Ready", // Mặc định trạng thái sẵn sàng
//                 CurrentLat = 0, // Tọa độ mặc định (cần sửa sau)
//                 CurrentLng = 0, 
//             };

//             await _context.Drones.AddAsync(drone);
//             await _context.SaveChangesAsync();

//             return new APIResponseModel
//             {
//                 code = 201,
//                 message = "Drone đã được thêm thành công.",
//                 Data = drone,
//                 IsSuccess = true
//             };
//         }

//         // Cập nhật trạng thái Drone (Sẵn sàng, Bảo trì, Pin yếu)
//         public async Task<APIResponseModel> UpdateDroneStatusAsync(int droneId, DroneUpdateStatusVM model)
//         {
//             var drone = await _context.Drones.FindAsync(droneId);
//             if (drone == null)
//             {
//                 return new APIResponseModel { code = 404, message = "Không tìm thấy Drone.", IsSuccess = false };
//             }

//             drone.Status = model.Status;
//             if (model.BatteryLevel.HasValue)
//             {
//                 drone.BatteryLevel = model.BatteryLevel.Value;
//             }
            
//             _context.Drones.Update(drone);
//             await _context.SaveChangesAsync();

//             return new APIResponseModel
//             {
//                 code = 200,
//                 message = $"Đã cập nhật trạng thái Drone {drone.Name} thành {drone.Status}.",
//                 Data = drone,
//                 IsSuccess = true
//             };
//         }

//         // Xóa Drone
//         public async Task<APIResponseModel> DeleteDroneAsync(int droneId)
//         {
//             var drone = await _context.Drones.FindAsync(droneId);
//             if (drone == null)
//             {
//                 return new APIResponseModel { code = 404, message = "Không tìm thấy Drone.", IsSuccess = false };
//             }

//             _context.Drones.Remove(drone);
//             await _context.SaveChangesAsync();

//             return new APIResponseModel { code = 200, message = "Drone đã được xóa.", IsSuccess = true };
//         }

//         // Logic tìm Drone sẵn sàng (phục vụ cho việc gửi đơn)
//         public async Task<Drone?> GetAvailableDroneAsync()
//         {
//             // Lấy Drone đầu tiên có trạng thái Ready và pin trên 50%
//             var availableDrone = await _context.Drones
//                 .Where(d => d.Status == "Ready" && d.BatteryLevel > 50)
//                 .FirstOrDefaultAsync();
                
//             return availableDrone;
//         }
//     }
// }









using AutoMapper;
using Business_Layer.Repositories;
using Data_Layer.Models;
using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel.DroneVMs;
using System.Collections.Generic;
using System.Threading.Tasks;
//using Business_Layer.Services.IDroneService;

namespace Business_Layer.Services
{
    public class DroneService : IDroneService
    {
        private readonly IDroneRepository _droneRepository;
        private readonly IMapper _mapper;

        // Inject Repository và AutoMapper
        public DroneService(IDroneRepository droneRepository, IMapper mapper)
        {
            _droneRepository = droneRepository;
            _mapper = mapper;
        }

        // public async Task<APIResponseModel> GetAllDronesAsync()
        // {
        //     // Gọi Repository để lấy dữ liệu
        //     var data = await _droneRepository.GetDroneCreateVM();

        //     return new APIResponseModel
        //     {
        //         code = 200,
        //         message = "Get list successfully",
        //         IsSuccess = true,
        //         Data = data
        //     };
        // }

        public async Task<APIResponseModel> GetAllDronesAsync()
        {
            // Gọi hàm mới GetAllDrones() trả về DroneVM
            var data = await _droneRepository.GetAllDrones();

            return new APIResponseModel
            {
                code = 200,
                message = "Get list successfully",
                IsSuccess = true,
                Data = data // Data này giờ đã có đủ ID, Status, Pin...
            };
        }

        public async Task<APIResponseModel> AddDroneAsync(DroneCreateVM model)
        {
            // Gọi Repository để thêm mới
            var result = await _droneRepository.AddDrone(model);
            
            if (result)
            {
                return new APIResponseModel
                {
                    code = 201,
                    message = "Add drone successfully",
                    IsSuccess = true,
                    Data = model
                };
            }

            return new APIResponseModel
            {
                code = 400,
                message = "Add drone failed",
                IsSuccess = false
            };
        }

        // Các hàm khác nếu Repository chưa hỗ trợ thì tạm thời return null 
        // hoặc bạn phải viết thêm trong Repository trước.
        public async Task<APIResponseModel> UpdateDroneStatusAsync(int id, DroneUpdateStatusVM model)
        {
             // Tạm thời trả về true để test API GetAll trước
             return new APIResponseModel { IsSuccess = true, message = "Feature coming soon" };
        }

        public async Task<APIResponseModel> DeleteDroneAsync(int id)
        {
             return new APIResponseModel { IsSuccess = true, message = "Feature coming soon" };
        }
    }
}