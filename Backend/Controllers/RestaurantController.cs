using Business_Layer.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

// --- KHU VỰC IMPORT NAMESPACE (QUAN TRỌNG) ---
// Import model đăng ký nhà hàng (file bạn mới tạo)
using Data_Layer.ResourceModel.ViewModel.Auth; 

// Import model UserRegisterModel (Model cũ của bạn)
// Mình thêm cả 2 namespace phổ biến để tránh lỗi "Not Found"
using Data_Layer.ResourceModel.ViewModel.User; 
using Data_Layer.ResourceModel.ViewModel; 
// ---------------------------------------------

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly IUserService _userService;

        public RestaurantController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRestaurantModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Chuyển đổi dữ liệu từ Model nhà hàng sang Model đăng ký User

                var registerData = GetRegisterData(model);

                // Gọi hàm đăng ký
                var result = await _userService.RegisterAsync(registerData);

                if (result.IsSuccess)
                {
                    return Ok(new { isSuccess = true, message = result.Message });
                }

                return BadRequest(new { isSuccess = false, message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi Server: " + ex.Message });
            }

            static RegisterVM GetRegisterData(RegisterRestaurantModel model)
            {
                return new RegisterVM
                {
                    Username = model.UserName,
                    Email = model.Email,
                    FullName = model.FullName,
                    phoneNumber = model.PhoneNumber,
                    Address = model.Address,
                    Password = model.Password,
                    ConfirmPassword = model.ConfirmPassword,

                    // Set cứng Role là Restaurant
                    Role = "Restaurant"
                };
            }
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllRestaurants()
        {
            try
            {
                var result = await _userService.GetRestaurantsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // PUT: Đổi trạng thái mở/đóng cửa
        [HttpPut("toggle-status/{id}")]
        public async Task<IActionResult> ToggleStatus(string id)
        {
            var result = await _userService.ToggleRestaurantStatus(id);
            return Ok(result);
        }

        // DELETE: Xóa nhà hàng (Có check ràng buộc)
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteRestaurant(string id)
        {
            var result = await _userService.DeleteRestaurantWithConstraint(id);
            if (!result.IsSuccess) return BadRequest(result); // Trả về lỗi 400 nếu có đơn hàng
            return Ok(result);
        }
    }
}