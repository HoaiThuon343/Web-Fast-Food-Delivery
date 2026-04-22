using System.ComponentModel.DataAnnotations;

namespace Data_Layer.ResourceModel.ViewModel.DroneVMs
{
    // Đối tượng dùng để cập nhật trạng thái
    public class DroneUpdateStatusVM
    {
        [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
        public string Status { get; set; }
        
        // Cập nhật mức pin
        public int? BatteryLevel { get; set; } 
    }
}