using AutoMapper;
using AutoMapper.QueryableExtensions; // Cần cho ProjectTo
using Business_Layer.DataAccess;
using Data_Layer.Models;
using Data_Layer.ResourceModel.ViewModel.DroneVMs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
//using Business_Layer.Repositories.IDroneRepository
using AutoMapper.QueryableExtensions;

namespace Business_Layer.Repositories
{
    public class DroneRepository : IDroneRepository
    {
        private readonly FastFoodDeliveryDBContext _context;
        private readonly IMapper _mapper;

        // Inject DBContext và AutoMapper
        public DroneRepository(FastFoodDeliveryDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // // 1. Lấy danh sách Drone và chuyển sang ViewModel
        // public async Task<List<DroneCreateVM>> GetDroneCreateVM()
        // {
        //     // Dùng ProjectTo để map trực tiếp từ Entity sang VM cho tối ưu
        //     return await _context.Drones
        //         .ProjectTo<DroneCreateVM>(_mapper.ConfigurationProvider)
        //         .ToListAsync();
        // }

        // // 2. Lấy 1 Drone theo ID
        // public async Task<DroneCreateVM> GetDroneCreateVMById(int Id)
        // {
        //     // Lưu ý: Nếu ID trong DB là kiểu int thì bạn phải sửa tham số Guid Id thành int Id
        //     var drone = await _context.Drones.FindAsync(Id);
            
        //     if (drone == null) return null;

        //     return _mapper.Map<DroneCreateVM>(drone);
        // }

        // Sửa hàm Lấy danh sách
        public async Task<List<DroneVM>> GetAllDrones()
        {
            return await _context.Drones
                .ProjectTo<DroneVM>(_mapper.ConfigurationProvider) // Map tự động sang DroneVM
                .ToListAsync();
        }

        // Sửa hàm Lấy 1 cái
        public async Task<DroneVM> GetDroneById(int Id)
        {
            var drone = await _context.Drones.FindAsync(Id);
            return _mapper.Map<DroneVM>(drone);
        }


        // 3. Thêm mới Drone
       public async Task<bool> AddDrone(DroneCreateVM menuDroneCreateVM)
        {
            try
            {
                // 1. Map dữ liệu từ VM sang Entity
                var droneEntity = _mapper.Map<Drone>(menuDroneCreateVM);
                
                // 2. GÁN GIÁ TRỊ MẶC ĐỊNH
                droneEntity.Status = "Ready";        
                droneEntity.BatteryLevel = 100;     
                droneEntity.CurrentLat = 0;          
                droneEntity.CurrentLng = 0;
                droneEntity.CurrentOrderId = null;    

                // --- SỬA LỖI Ở ĐÂY: Gán tay tên Drone ---
                // Vì AutoMapper không tự map NameDrone -> Name được
                droneEntity.Name = menuDroneCreateVM.NameDrone; 
                // ---------------------------------------

                // 3. Lưu vào DB
                await _context.Drones.AddAsync(droneEntity);
                return await _context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                // --- SỬA ĐOẠN NÀY ---
                // Thay vì return false, hãy ném lỗi ra để xem chi tiết trên Swagger
                // Nó sẽ cho biết chính xác cột nào bị lỗi (VD: String truncated, Invalid column...)
                throw new Exception($"Lỗi lưu DB: {ex.Message} | Chi tiết: {ex.InnerException?.Message}");
            }
        }
    }
}