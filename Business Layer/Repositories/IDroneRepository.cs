// using Data_Layer.Models; // Thay bằng namespace chứa Entity Drone của bạn
// using System.Collections.Generic;
// using System.Threading.Tasks;
// using Data_Layer.ResourceModel.ViewModel;
// using Data_Layer.ResourceModel.ViewModel.DroneVMs;
// namespace Business_Layer.Repositories
// {
//     // Kế thừa IGenericRepository nếu bạn có dùng pattern này
//     public interface IDroneRepository //: IGenericRepository<Drone> 
//     {
//         // Khai báo thêm các hàm riêng nếu cần, ví dụ:
//         // Task<IEnumerable<Drone>> GetActiveDrones();
        
//         Task<List<DroneCreateVM>> GetDroneCreateVM();
//         Task<DroneCreateVM> GetDroneCreateVMById(int Id);
//         Task<bool> AddDrone(DroneCreateVM menuDroneCreateVM);
//     }
// }





using Data_Layer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Data_Layer.ResourceModel.ViewModel.DroneVMs; // Đảm bảo có dòng này

namespace Business_Layer.Repositories
{
    public interface IDroneRepository 
    {
        // 1. Đổi tên hàm thành GetAllDrones cho chuẩn nghĩa
        // 2. Đổi kiểu trả về thành List<DroneVM> (để có ID, Pin, Status...)
        Task<List<DroneVM>> GetAllDrones(); 

        // Tương tự, lấy 1 cái thì cũng cần đầy đủ thông tin
        Task<DroneVM> GetDroneById(int Id);

        // Hàm thêm mới giữ nguyên (vì thêm mới thì dùng CreateVM là đúng)
        Task<bool> AddDrone(DroneCreateVM model);
    }
}