using AutoMapper;
using Business_Layer.Repositories;
using Business_Layer.Utils;
using Data_Layer.Models;
using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel;
using Data_Layer.ResourceModel.ViewModel.Enum;
using Data_Layer.ResourceModel.ViewModel.User;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business_Layer.Commons;
namespace Business_Layer.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IClaimsService _claimsService;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IOrderRepository _orderRepository;
        public UserService(IUserRepository userRepository, 
                           IClaimsService claimsService, 
                           IMapper mapper, 
                           UserManager<User> userManager,
                           RoleManager<IdentityRole> roleManager,
                           IOrderRepository orderRepository)
        {
            _userRepository = userRepository;
            _claimsService = claimsService;
            _mapper = mapper;
            _userManager = userManager;
            _roleManager = roleManager;
            _orderRepository = orderRepository;
        }

        // --- 1. RegisterAsync ---
        public async Task<(bool IsSuccess, string Message)> RegisterAsync(RegisterVM model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null) return (false, "Username đã tồn tại!");

            var emailExists = await _userManager.FindByEmailAsync(model.Email);
            if (emailExists != null) return (false, "Email đã tồn tại!");

            User user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                FullName = model.FullName,
                PhoneNumber = model.phoneNumber,
                Address = model.Address,
                Status = "Active"
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                string errorMsg = "Tạo tài khoản thất bại: ";
                foreach (var error in result.Errors) errorMsg += error.Description + " ";
                return (false, errorMsg);
            }

            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole(model.Role));
            }

            if (await _roleManager.RoleExistsAsync(model.Role))
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            return (true, "Đăng ký thành công!");
        }

        public async Task<APIResponseModel> GetRestaurantsAsync()
        {
            var response = new APIResponseModel();
            List<UserViewModel> list = new List<UserViewModel>();
            try
            {
                var users = await _userRepository.GetUserAccountAll();
                foreach (var u in users)
                {
                    var roles = await _userManager.GetRolesAsync(u);
                    
                    // LỌC QUAN TRỌNG: Chỉ lấy những tài khoản có Role là Restaurant 
                    // VÀ trạng thái KHÔNG phải là IsDeleted (giả định trạng thái xóa là IsDeleted)
                    if (roles.Contains("Restaurant") && u.Status != "IsDeleted") 
                    {
                        var mapper = _mapper.Map<UserViewModel>(u);
                        mapper.Role = "Restaurant";
                        list.Add(mapper);
                    }
                }
                response.code = 200;
                response.Data = list;
                response.IsSuccess = true;
                response.message = $"Found {list.Count} Restaurants";
                return response;
            }
            catch (Exception e)
            {
                response.IsSuccess = false;
                response.message = e.Message;
                return response;
            }
        }

        // --- 2. GetUserById (ĐÃ THÊM VÀO ĐÂY ĐỂ SỬA LỖI) ---
        public async Task<UserViewModel> GetUserById(string id)
        {
            // Tìm user theo ID
            var user = await _userRepository.GetUserByID(id);
            if (user == null) return null;

            // Map sang ViewModel
            var userVM = _mapper.Map<UserViewModel>(user);
            
            // Lấy Role để hiển thị (nếu cần)
            var roles = await _userManager.GetRolesAsync(user);
            userVM.Role = roles.FirstOrDefault();

            return userVM;
        }

        // --- 3. Các hàm cũ khác ---

        public async Task<APIResponseModel> UpdateUser(string id, UserUpdateViewModel model)
        {
            var response = new APIResponseModel();
            try {
                var user = await _userRepository.GetUserByID(id);
                if (user == null ) {
                    response.IsSuccess = false; response.message = "Account is not exist";
                } else {
                    user.FullName = model.FullName;
                    user.Address = model.Address;
                    user.Email = model.Email;
                    user.PhoneNumber = model.PhoneNumber;
                    user.Status = UserEnum.Active.ToString();
                    _userRepository.Update(user);
                    if (await _userRepository.SaveAsync() > 0) {
                        response.code = 200; response.IsSuccess = true; response.message = "Update Successfully";
                    } else {
                        response.IsSuccess = false; response.message = "Update fail";
                    }
                }
            } catch (Exception ex) { response.IsSuccess = false; response.message = ex.Message; }
            return response;
        }

        public async Task<APIResponseModel> DeleteUser (string id)
        {
            var reponse = new APIResponseModel();
            try {
                var user = await _userRepository.GetUserByID(id);
                if (user == null) throw new Exception("User not found");
                
                user = _userRepository.UpdateStatusUser(user);
                if (await _userRepository.SaveAsync() > 0) {
                     reponse.IsSuccess = true; reponse.message = "Delete Successful";
                } else {
                     reponse.IsSuccess = false; reponse.message = "Delete fail";
                }
            } catch (Exception e) { reponse.IsSuccess = false; reponse.message = e.Message; }
            return reponse;
        }

        public async Task<Pagination<UserViewModel>> GetUserPagingsionsAsync(int pageIndex = 0, int pageSize = 10)
        {
            var users = await _userRepository.ToPagination(pageIndex, pageSize);
            return users.ToUserViewModel();
        }

        public async Task<APIResponseModel> GetUsersAsync()
        {
            var response = new APIResponseModel();
            List<UserViewModel> userDTOs = new List<UserViewModel>();
            try {
                var users = await _userRepository.GetUserAccountAll();
                foreach (var user in users) {
                    var roles = await _userManager.GetRolesAsync(user);
                    var roleFirst = roles.FirstOrDefault();
                    if (roleFirst != null && (roleFirst == "User" || roleFirst == "Admin" || roleFirst == "Restaurant")) {
                        var mapper = _mapper.Map<UserViewModel>(user);
                        mapper.Role = roleFirst;
                        userDTOs.Add(mapper);
                    }
                }
                response.code = 200; response.Data = userDTOs; response.IsSuccess = true;
                return response;
            } catch (Exception e) { response.IsSuccess = false; response.message = e.Message; return response; }
        }

        public async Task<APIResponseModel> GetShippersAsync()
        {
            var response = new APIResponseModel();
            List<UserViewModel> list = new List<UserViewModel>();
            try {
                var users = await _userRepository.GetUserAccountAll();
                foreach (var u in users) {
                    var roles = await _userManager.GetRolesAsync(u);
                    if (roles.Contains("Shipper")) {
                        var mapper = _mapper.Map<UserViewModel>(u);
                        mapper.Role = "Shipper";
                        list.Add(mapper);
                    }
                }
                response.code = 200; response.Data = list; response.IsSuccess = true;
                return response;
            } catch (Exception e) { response.IsSuccess = false; response.message = e.Message; return response; }
        }

        public async Task<APIResponseModel> UpdateShipper(string id, UserUpdateViewModel model)
        {
             return await UpdateUser(id, model); 
        }

        public async Task<APIResponseModel> DeleteShipper(string id)
        {
            return await DeleteUser(id); 
        }

                // 2. Viết hàm đổi trạng thái (Cho nhà hàng tự dùng)
        public async Task<APIResponseModel> ToggleRestaurantStatus(string id)
        {
            var response = new APIResponseModel();
            try {
                var user = await _userRepository.GetUserByID(id);
                if (user == null) { 
                    response.IsSuccess = false; response.message = "Không tìm thấy nhà hàng"; return response;
                }

                // Đổi trạng thái: Nếu đang Active -> Inactive (Đóng cửa) và ngược lại
                if (user.Status == "Active") user.Status = "Inactive"; // Hoặc "Closed"
                else user.Status = "Active";

                _userRepository.Update(user);
                await _userRepository.SaveAsync();

                response.IsSuccess = true;
                response.message = $"Đã chuyển trạng thái thành: {user.Status}";
                response.Data = user.Status;
            } catch (Exception ex) { response.IsSuccess = false; response.message = ex.Message; }
            return response;
        }

        // 3. Viết hàm xóa có ràng buộc (Cho Admin)
        public async Task<APIResponseModel> DeleteRestaurantWithConstraint(string id)
        {
            var response = new APIResponseModel();
            try {
                // --- RÀNG BUỘC QUAN TRỌNG ---
                // Kiểm tra xem nhà hàng này có đơn hàng nào CHƯA HOÀN THÀNH không
                // Giả sử logic check order:
                var hasActiveOrders = await _orderRepository.CheckActiveOrdersByRestaurantId(id); 
                // (Nếu chưa có hàm này trong Repo, bạn cần viết câu Query: Select count(*) from Orders where RestaurantId = id AND Status != 'Completed'...)

                if (hasActiveOrders) 
                {
                    response.IsSuccess = false;
                    response.message = "Không thể xóa! Nhà hàng này đang có đơn hàng chưa hoàn thành.";
                    return response;
                }
                // -----------------------------

                // Nếu không có đơn hàng thì gọi hàm xóa cũ
                return await DeleteUser(id); 
            } 
            catch (Exception ex) { response.IsSuccess = false; response.message = ex.Message; return response; }
        }
    }
}