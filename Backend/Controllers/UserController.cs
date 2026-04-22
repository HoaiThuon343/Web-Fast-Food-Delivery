using Business_Layer.Repositories;
using Business_Layer.Services;
using Data_Layer.Models;
using Data_Layer.ResourceModel.Common;
using Data_Layer.ResourceModel.ViewModel.User;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public UserController(IUserRepository userRepository, IUserService userService, IMapper mapper)
        {
            _userRepository = userRepository;
            _userService = userService;
            _mapper = mapper;
        }
        [HttpGet("GetUserPagination")]
        public async Task<APIResponseModel> GetUserPagination(int pageIndex = 0, int pageSize = 10)
        {
            var users = await _userService.GetUserPagingsionsAsync(pageIndex, pageSize);
            return new APIResponseModel()
            {
                code = 200,
                message = "List 10 User",
                IsSuccess = true,
                Data = users
            };
        }
        [HttpGet]
        [EnableCors("CorsPolicy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ViewAllACcountUser()
        {
            var result = await _userService.GetUsersAsync();
            return Ok(result);
        }
        [NonAction]
        public async Task<IEnumerable<UserViewModel>> GetUsersAsync() 
        {
    // 1. Lấy dữ liệu Model (users là IEnumerable<User>)
            var users = await _userRepository.GetUserAccountAll(); 

            // 2. Chuyển đổi Model sang ViewModel bằng AutoMapper
            // (Bạn phải đảm bảo Mapping User -> UserViewModel đã được cấu hình)
            var userViewModels = _mapper.Map<IEnumerable<UserViewModel>>(users);
            return userViewModels;
        }   
        [HttpGet("GetUserById/{id}")]
        public async Task<APIResponseModel> GetUserById(string id)
        {
            try
            {
                var user = await _userService.GetUserById(id);
                return new APIResponseModel
                {
                    code = 200,
                    IsSuccess = true,
                    Data = user,
                    message = "User Founded !",
                };
            }
            catch (Exception ex)
            {
                return new APIResponseModel()
                {
                    code = StatusCodes.Status400BadRequest,
                    message = ex.Message,
                    Data = ex,
                    IsSuccess = false
                };
            }
        }
        [HttpPost("login")]
        [EnableCors("CorsPolicy")]
        public async Task<APIResponseModel> Login([FromBody] LoginVM model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                                  .Select(e => e.ErrorMessage).ToList();
                    return new APIResponseModel
                    {
                        code = 400,
                        Data = errors,
                        IsSuccess = false,
                        message = string.Join(";", errors)
                    };
                }

                var result = await _userRepository.Login(model);
                return result;

            }
            catch (Exception ex)
            {
                return new APIResponseModel()
                {
                    code = StatusCodes.Status400BadRequest,
                    message = ex.Message,
                    Data = ex,
                    IsSuccess = false
                };
            }
        }

        [HttpPost("register")]
        [EnableCors("CorsPolicy")]
        public async Task<APIResponseModel> Register([FromBody] RegisterVM model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                                  .Select(e => e.ErrorMessage).ToList();
                    return new APIResponseModel
                    {
                        code = 400,
                        Data = errors,
                        IsSuccess = false,
                        message = string.Join(";", errors)
                    };


                }

                var result = await _userRepository.Register(model);
                return result;

            }
            catch (Exception ex)
            {
                return new APIResponseModel()
                {
                    code = StatusCodes.Status400BadRequest,
                    message = ex.Message,
                    Data = ex,
                    IsSuccess = false
                };
            }
        }
        
        [HttpPut("UpdateUser")]
        [EnableCors("CorsPolicy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task <IActionResult> UpdateUser(string id, [FromBody] UserUpdateViewModel model)
        {
           
              var user = await _userService.UpdateUser(id, model);
                if( !user.IsSuccess )
                {
                    return BadRequest(user);
                }
            return Ok(user);

        }
        [HttpDelete("DeleteUser")]
        [EnableCors("CorsPolicy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var deleteSuccess = await _userService.DeleteUser(id);
            if(!deleteSuccess.IsSuccess)
            {
                return BadRequest(deleteSuccess);
            }
            return Ok(deleteSuccess);
        }        
    }
}
