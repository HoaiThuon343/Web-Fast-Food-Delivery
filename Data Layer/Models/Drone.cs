using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations.Schema;



namespace Data_Layer.Models

{

    [Table("Drone")]

    public class Drone

    {

        [Key]

        public int DroneId { get; set; } // Hoặc Guid tùy thiết kế cũ của bạn



        [Required]

        public string Name { get; set; } // Tên Drone: "Drone #1"



        public string? Model { get; set; } // Loại: "DJI", "Tự chế"



        public int BatteryLevel { get; set; } = 100; // Mặc định 100%



        // Trạng thái: "Ready" (Sẵn sàng), "Busy" (Đang giao), "Maintenance" (Bảo trì), "LowBattery" (Pin yếu)

        public string Status { get; set; } = "Ready";



        // Tọa độ cho bản đồ Leaflet/Google Map

        public double CurrentLat { get; set; }

        public double CurrentLng { get; set; }



        // Khóa ngoại liên kết với Đơn hàng đang giao (nếu có)

        public Guid? CurrentOrderId { get; set; }

        public virtual Order CurrentOrder { get; set; } // <--- ĐÂY LÀ D.CURRENTORDER

       

        // Nếu bạn muốn Drone thuộc về một Nhà hàng cụ thể (Private Fleet)

         public int? RestaurantId { get; set; }

    }

}