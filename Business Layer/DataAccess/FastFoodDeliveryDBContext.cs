using Business_Layer.Configuration;
using Data_Layer.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using System.IO; // Thêm thư viện này để dùng Directory


namespace Business_Layer.DataAccess
{
    public class FastFoodDeliveryDBContext : IdentityDbContext<User>
    {

        public FastFoodDeliveryDBContext() { }
        public FastFoodDeliveryDBContext(DbContextOptions<FastFoodDeliveryDBContext> options) : base(options) { }

        public DbSet<MenuFoodItem> MenuFoodItems { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        // public DbSet<User> Users { get; set; }
        public DbSet<TransactionBill> Transactions { get; set; }
        public  DbSet<OrderStatus> OrderStatuses { get; set; }
        public DbSet<FeedBack> FeedBacks { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Drone> Drones { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                //                optionsBuilder.UseSqlServer(GetConnectionString());

                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();
                optionsBuilder.UseSqlServer(config.GetConnectionString("Db"));
            }
        }

        //   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     if (!optionsBuilder.IsConfigured)
        //     {
        //         var config = new ConfigurationBuilder()
        //             .SetBasePath(Directory.GetCurrentDirectory())
        //             .AddJsonFile("appsettings.json")
        //             .Build();
        //         optionsBuilder.UseSqlServer(config.GetConnectionString("Db"));
        //     }
        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new MenuFoodItemConfiguration());
            modelBuilder.ApplyConfiguration(new CartConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new OrderDetailConfiguration());
            modelBuilder.ApplyConfiguration(new TransactionBillConfiguration());
            modelBuilder.ApplyConfiguration(new OrderStatusConfiguration());
            modelBuilder.ApplyConfiguration(new FeedBackConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            // === CẤU HÌNH KHÓA NGOẠI CHO DRONE ===
            modelBuilder.Entity<Drone>()
                .HasOne(d => d.CurrentOrder) // Thiết lập mối quan hệ 1-1 (một Drone chỉ có một Order đang giao)
                .WithMany() // Order này không cần biết về Drone (hoặc bạn có thể sửa ở đây nếu cần)
                .HasForeignKey(d => d.CurrentOrderId) // Khóa ngoại trong bảng Drone là CurrentOrderId
                .OnDelete(DeleteBehavior.SetNull); // Nếu đơn hàng bị xóa, Drone sẽ được set về trạng thái rảnh (NULL)
            base.OnModelCreating(modelBuilder);


        }



    }
}
