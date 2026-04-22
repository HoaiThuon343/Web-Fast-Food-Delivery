using Business_Layer.Commons;
using Data_Layer.Models;
using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel.User;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business_Layer.Services
{
    public interface IUserService
    {
        Task<APIResponseModel> GetUsersAsync();
        Task<APIResponseModel> GetRestaurantsAsync();
        Task<APIResponseModel> GetShippersAsync();
        Task<APIResponseModel> UpdateShipper(string id, UserUpdateViewModel model);
        Task<APIResponseModel> DeleteShipper(string id);
        Task<UserViewModel> GetUserById(string id);
        Task<APIResponseModel> UpdateUser(string id, UserUpdateViewModel model);
        Task<APIResponseModel> DeleteUser (string id);
        // Trong Business_Layer/Services/IUserService.cs
        Task<APIResponseModel> ToggleRestaurantStatus(string id); // Hàm đổi trạng thái (Mở/Đóng cửa)
        Task<APIResponseModel> DeleteRestaurantWithConstraint(string id); // Hàm xóa có ràng buộc
        Task<Pagination<UserViewModel>> GetUserPagingsionsAsync(int pageIndex = 0, int pageSize = 10);
        Task<(bool IsSuccess, string Message)> RegisterAsync(RegisterVM model);
    }
}
