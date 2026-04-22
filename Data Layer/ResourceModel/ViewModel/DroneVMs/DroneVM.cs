using System;

namespace Data_Layer.ResourceModel.ViewModel.DroneVMs
{
    public class DroneVM
    {
        public int Id { get; set; }
        public string Name { get; set; } // Frontend đang đợi field "name"
        public string Model { get; set; }
        public int BatteryLevel { get; set; }
        public string Status { get; set; }
        public double CurrentLat { get; set; }
        public double CurrentLng { get; set; }
    }
}