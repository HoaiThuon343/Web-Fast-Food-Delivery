// using Data_Layer.Models;
// using Data_Layer.ResourceModel.Common;
// using Data_Layer.ResourceModel.ViewModel.DroneVMs;

// namespace Business_Layer.Services
// {
//     // Interface định nghĩa các hành động liên quan đến Drone
//     public interface IDroneService
//     {
//         Task<APIResponseModel> AddDroneAsync(DroneCreateVM model);
//         Task<APIResponseModel> GetAllDronesAsync();
//         Task<APIResponseModel> UpdateDroneStatusAsync(int droneId, DroneUpdateStatusVM model);
//         Task<APIResponseModel> DeleteDroneAsync(int droneId);
//         Task<Drone?> GetAvailableDroneAsync();
//     }
// }






using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel.DroneVMs;
using System.Threading.Tasks;

namespace Business_Layer.Services
{
    public interface IDroneService
    {
        Task<APIResponseModel> GetAllDronesAsync();
        Task<APIResponseModel> AddDroneAsync(DroneCreateVM model);
        Task<APIResponseModel> UpdateDroneStatusAsync(int id, DroneUpdateStatusVM model);
        Task<APIResponseModel> DeleteDroneAsync(int id);
    }
}