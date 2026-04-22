using System.ComponentModel.DataAnnotations;

namespace Data_Layer.ResourceModel.ViewModel.DroneVMs
{
    // Đối tượng dùng để tạo Drone mới
    public class DroneCreateVM
    {
        [Required(ErrorMessage = "Tên Drone là bắt buộc.")]
        [MaxLength(100)]
        public string? NameDrone { get; set; }

        public string? Model { get; set; }
    }
}