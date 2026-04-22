// using AutoMapper;
// using Data_Layer.Models;
// using Data_Layer.ResourceModel.ViewModel;
// using Data_Layer.ResourceModel.ViewModel.CartVMs;
// using Data_Layer.ResourceModel.ViewModel.Category;
// using Data_Layer.ResourceModel.ViewModel.FeedBackVMs;
// using Data_Layer.ResourceModel.ViewModel.MenuFoodItemVMs;
// using Data_Layer.ResourceModel.ViewModel.OrderDetailVMs;
// using Data_Layer.ResourceModel.ViewModel.OrderStatusVMs;
// using Data_Layer.ResourceModel.ViewModel.OrderVMs;
// using Data_Layer.ResourceModel.ViewModel.User;
// using Data_Layer.ResourceModel.ViewModel.DroneVMs;

// namespace Business_Layer.AutoMapper
// {
//     public class ApplicationMapper : Profile
//     {
//         public ApplicationMapper()
//         {
//             CreateMap<MenuFoodItem, MenuFoodItemVM>().ReverseMap();
//             CreateMap<Category, CategoryVM>().ReverseMap();
//             CreateMap<Category, CategoryCreateVM>().ReverseMap();
//             CreateMap<Category, CategoryUpdateVM>().ReverseMap();

//             CreateMap<Order, OrderVM>().ReverseMap();

//             CreateMap<Order, OrderViewVM>().ReverseMap();
//             CreateMap<Order, OrderCreateVM>().ReverseMap();
//             CreateMap<Order, OrderUpdateVM>().ReverseMap();
//             CreateMap<Order, OrderPaymentVM>().ReverseMap();
//             CreateMap<Order, OrderUpdateForShipperVM>().ReverseMap();

//             CreateMap<OrderDetail, OrderDetailViewVM>().ReverseMap();
//             CreateMap<OrderDetail, OrderDetaiCreateVM>().ReverseMap();
//             CreateMap<OrderDetail, OrderDetailUpdateVM>().ReverseMap();

//             CreateMap<MenuFoodItem, MenuFoodItemViewVM>().ReverseMap();
//             CreateMap<MenuFoodItem, MenuFoodItemCreateVM>().ReverseMap();
//             CreateMap<MenuFoodItem, MenuFoodItemUpdateVM>().ReverseMap();

//             CreateMap<Cart, CartCreateVM>().ReverseMap();
//             CreateMap<Cart, CartUpdateVM>().ReverseMap();
//             CreateMap<Cart, CartViewVM>().ReverseMap();

//             CreateMap<FeedBack, FeedBackCreateVM>().ReverseMap();
//             CreateMap<FeedBack, FeedBackUpdateVM>().ReverseMap();
//             CreateMap<FeedBack, FeedBackViewVM>().ReverseMap();

//             CreateMap<User, UserViewModel>().ReverseMap();

//             CreateMap<OrderStatus, OrderStatusVM>().ReverseMap();
//             CreateMap<OrderStatus, OrderStatusViewVM>().ReverseMap();
//             CreateMap<OrderStatus, OrderStatusUpdateVM>().ReverseMap();

//             CreateMap<Drone, DroneCreateVM>().ReverseMap();

//         }
//     }
// }





using AutoMapper;
using Data_Layer.Models;
using Data_Layer.ResourceModel.ViewModel;
using Data_Layer.ResourceModel.ViewModel.CartVMs;
using Data_Layer.ResourceModel.ViewModel.Category;
using Data_Layer.ResourceModel.ViewModel.FeedBackVMs;
using Data_Layer.ResourceModel.ViewModel.MenuFoodItemVMs;
using Data_Layer.ResourceModel.ViewModel.OrderDetailVMs;
using Data_Layer.ResourceModel.ViewModel.OrderStatusVMs;
using Data_Layer.ResourceModel.ViewModel.OrderVMs;
using Data_Layer.ResourceModel.ViewModel.User;
using Data_Layer.ResourceModel.ViewModel.DroneVMs;

namespace Business_Layer.AutoMapper
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            // --- MenuFoodItem ---
            CreateMap<MenuFoodItem, MenuFoodItemVM>().ReverseMap();
            CreateMap<MenuFoodItem, MenuFoodItemViewVM>().ReverseMap();
            CreateMap<MenuFoodItem, MenuFoodItemCreateVM>().ReverseMap();
            CreateMap<MenuFoodItem, MenuFoodItemUpdateVM>().ReverseMap();

            // --- Category ---
            CreateMap<Category, CategoryVM>().ReverseMap();
            CreateMap<Category, CategoryCreateVM>().ReverseMap();
            CreateMap<Category, CategoryUpdateVM>().ReverseMap();

            // --- Order ---
            CreateMap<Order, OrderVM>().ReverseMap();
            CreateMap<Order, OrderViewVM>().ReverseMap();
            CreateMap<Order, OrderCreateVM>().ReverseMap();
            CreateMap<Order, OrderUpdateVM>().ReverseMap();
            CreateMap<Order, OrderPaymentVM>().ReverseMap();
            CreateMap<Order, OrderUpdateForShipperVM>().ReverseMap();

            // --- OrderDetail ---
            CreateMap<OrderDetail, OrderDetailViewVM>().ReverseMap();
            CreateMap<OrderDetail, OrderDetaiCreateVM>().ReverseMap();
            CreateMap<OrderDetail, OrderDetailUpdateVM>().ReverseMap();
            CreateMap<OrderDetail, OrderDetailViewVM>().ForMember(dest => dest.FoodName, opt => opt.MapFrom(src => src.MenuFoodItem.FoodName));

            // --- Cart ---
            CreateMap<Cart, CartCreateVM>().ReverseMap();
            CreateMap<Cart, CartUpdateVM>().ReverseMap();
            CreateMap<Cart, CartViewVM>().ReverseMap();

            // --- FeedBack ---
            CreateMap<FeedBack, FeedBackCreateVM>().ReverseMap();
            CreateMap<FeedBack, FeedBackUpdateVM>().ReverseMap();
            CreateMap<FeedBack, FeedBackViewVM>().ReverseMap();

            // --- User (SỬA THÊM Ở ĐÂY) ---
            CreateMap<User, UserViewModel>().ReverseMap();
            CreateMap<User, UserUpdateViewModel>().ReverseMap(); // <--- Thêm dòng này để sửa lỗi Update User
            CreateMap<User, RegisterVM>().ReverseMap();          // <--- Thêm dòng này để hỗ trợ Register

            // --- OrderStatus ---
            CreateMap<OrderStatus, OrderStatusVM>().ReverseMap();
            CreateMap<OrderStatus, OrderStatusViewVM>().ReverseMap();
            CreateMap<OrderStatus, OrderStatusUpdateVM>().ReverseMap();

            // --- Drone (SỬA THÊM Ở ĐÂY) ---
            CreateMap<Drone, DroneCreateVM>().ReverseMap();
            CreateMap<Drone, DroneUpdateStatusVM>().ReverseMap(); // <--- Thêm dòng này để sửa lỗi Update Status Drone
            // Map từ Entity Drone sang ViewModel hiển thị
            CreateMap<Drone, DroneVM>().ReverseMap();

            
        }

    }
}