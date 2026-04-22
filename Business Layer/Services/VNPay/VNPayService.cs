using Business_Layer.Repositories;
using Data_Layer.ResourceModel.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;

namespace Business_Layer.Services.VNPay
{
    public class VNPayService : IVNPayService
    {
        private readonly VNPaySettings _vnPaySettings;
        private readonly IOrderRepository _orderRepository;

        public VNPayService(IOptions<VNPaySettings> vnPaySettings, IOrderRepository orderRepository)
        {
            _vnPaySettings = vnPaySettings.Value;
            _orderRepository = orderRepository;
        }

        public async Task<string> CreatePaymentRequestAsync(Guid orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new ArgumentException("Order doesn't exist.");

            // Logic tính tiền
            int amount = (int)(order.TotalPrice ?? 0);
            
            // Dùng chính OrderId làm mã giao dịch để dễ tra cứu (Thay vì DateTime.Ticks)
            string txnRef = order.OrderId.ToString(); 

            VNPayHelper pay = new VNPayHelper();
            pay.AddRequestData("vnp_Version", "2.1.0");
            pay.AddRequestData("vnp_Command", "pay");
            pay.AddRequestData("vnp_TmnCode", _vnPaySettings.TmnCode);
            pay.AddRequestData("vnp_Amount", (amount * 100).ToString()); // Nhân 100 theo quy định VNPAY
            pay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", "VND");
            
            // IP Address giả lập nếu chạy localhost (để tránh lỗi IP)
            pay.AddRequestData("vnp_IpAddr", "127.0.0.1"); 
            
            pay.AddRequestData("vnp_Locale", "vn");
            pay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang " + order.OrderId);
            pay.AddRequestData("vnp_OrderType", "other");
            pay.AddRequestData("vnp_ReturnUrl", _vnPaySettings.ReturnUrl);
            pay.AddRequestData("vnp_TxnRef", txnRef); // Dùng GUID làm mã giao dịch

            string paymentUrl = pay.CreateRequestUrl(_vnPaySettings.Url, _vnPaySettings.HashSecret);
            return paymentUrl;
        }

        public async Task<APIResponseModel> ConfirmPaymentAsync(IQueryCollection queryString)
        {
            var response = new APIResponseModel();
            var queryParameters = new Dictionary<string, string>();

            foreach (var key in queryString.Keys)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    queryParameters.Add(key, queryString[key]);
                }
            }

            string vnp_SecureHash = queryString["vnp_SecureHash"];
            long vnp_Amount = Convert.ToInt64(queryParameters["vnp_Amount"]) / 100;
            string vnp_ResponseCode = queryParameters["vnp_ResponseCode"];
            string vnp_TxnRef = queryParameters["vnp_TxnRef"]; // Đây chính là OrderId (GUID)

            // Validate Signature
            // Cần tạo lại RawData để hash (phải sắp xếp theo alphabet key)
            // Lưu ý: Class VNPayHelper của bạn cần có hàm ValidateSignature public hoặc dùng logic dưới
            bool checkSignature = ValidateSignature(queryParameters, vnp_SecureHash, _vnPaySettings.HashSecret);

            if (!checkSignature)
            {
                return new APIResponseModel { IsSuccess = false, message = "Invalid Signature!" };
            }

            // Tìm đơn hàng
            Guid orderId = Guid.Parse(vnp_TxnRef); // Parse từ TxnRef
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order != null)
            {
                if (vnp_ResponseCode == "00")
                {
                    order.StatusOrder = "Paid"; // Cập nhật trạng thái
                    await _orderRepository.SaveAsync();
                    
                    // Trả về URL Frontend thành công
                    response.IsSuccess = true;
                    response.message = $"http://localhost:5173/paymentSuccess?orderId={orderId}";
                }
                else
                {
                    order.StatusOrder = "PaymentFailed";
                    await _orderRepository.SaveAsync();
                    
                    // Trả về URL Frontend thất bại
                    response.IsSuccess = false;
                    response.message = $"http://localhost:5173/paymentFail";
                }
            }
            
            return response;
        }

        // Hàm validate chữ ký (Sửa lại logic hash cho chuẩn)
        private bool ValidateSignature(Dictionary<string, string> queryParams, string inputHash, string secretKey)
        {
            string rspraw = GetResponseData(queryParams);
            string myChecksum = VNPayHelper.HmacSHA512(secretKey, rspraw);
            return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string GetResponseData(Dictionary<string, string> requestData)
        {
            StringBuilder data = new StringBuilder();
            if (requestData.ContainsKey("vnp_SecureHashType"))
            {
                requestData.Remove("vnp_SecureHashType");
            }
            if (requestData.ContainsKey("vnp_SecureHash"))
            {
                requestData.Remove("vnp_SecureHash");
            }
            foreach (KeyValuePair<string, string> kv in requestData.OrderBy(k => k.Key))
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }
            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }
            return data.ToString();
        }
    }
}