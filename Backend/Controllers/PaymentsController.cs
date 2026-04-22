using Business_Layer.Services;
using Business_Layer.Services.VNPay; // Sửa namespace cho đúng
using Data_Layer.Models;
using Data_Layer.ResourceModel.ViewModel.OrderVMs;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : Controller
    {
        private readonly IVNPayService _vnPayService;

        public PaymentsController(IVNPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        // 1. Tạo URL thanh toán
        [HttpPost("VNPay")]
        [EnableCors("CorsPolicy")]
        public async Task<IActionResult> VnPaymentRequest([FromBody] OrderPaymentVM model)
        {
            try
            {
                var paymentUrl = await _vnPayService.CreatePaymentRequestAsync(model.OrderId);
                return Ok(new { url = paymentUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 2. Xử lý kết quả trả về từ VNPAY (Callback)
        // Đây là URL mà bạn cài đặt trong ReturnUrl
        [HttpGet("PaymentConfirm")]
        [EnableCors("CorsPolicy")]
        public async Task<IActionResult> PaymentConfirm()
        {
            if (Request.QueryString.HasValue)
            {
                try
                {
                    // Gọi Service để kiểm tra chữ ký và cập nhật Database
                    var result = await _vnPayService.ConfirmPaymentAsync(Request.Query);

                    if (result.IsSuccess)
                    {
                        // Thành công -> Chuyển hướng về trang PaymentSuccess của React
                        return Redirect(result.message); 
                    }
                    else
                    {
                        // Thất bại -> Chuyển hướng về trang PaymentFail
                        return Redirect(result.message);
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            return BadRequest("No query data");
        }
    }
}