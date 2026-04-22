using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Business_Layer.Migrations
{
    public partial class RemoveShipperColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShipperId",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Drone",
                newName: "DroneId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ShippedDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 11, 30, 9, 42, 20, 907, DateTimeKind.Local).AddTicks(408),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 11, 25, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2325));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequiredDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 11, 28, 9, 42, 20, 907, DateTimeKind.Local).AddTicks(323),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 11, 23, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2221));

            migrationBuilder.AlterColumn<DateTime>(
                name: "OrderDate",
                table: "Order",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 25, 9, 42, 20, 907, DateTimeKind.Local).AddTicks(101),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 11, 20, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(1997));

            migrationBuilder.AddColumn<int>(
                name: "DroneId",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RestaurantLat",
                table: "Order",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "RestaurantLng",
                table: "Order",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Order",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "UserLat",
                table: "Order",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "UserLng",
                table: "Order",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AlterColumn<Guid>(
                name: "CurrentOrderId",
                table: "Drone",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateIndex(
                name: "IX_Order_DroneId",
                table: "Order",
                column: "DroneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Drone_DroneId",
                table: "Order",
                column: "DroneId",
                principalTable: "Drone",
                principalColumn: "DroneId",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_Drone_DroneId",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_DroneId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DroneId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "RestaurantLat",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "RestaurantLng",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "UserLat",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "UserLng",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "DroneId",
                table: "Drone",
                newName: "Id");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ShippedDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 11, 25, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2325),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 11, 30, 9, 42, 20, 907, DateTimeKind.Local).AddTicks(408));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequiredDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 11, 23, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2221),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 11, 28, 9, 42, 20, 907, DateTimeKind.Local).AddTicks(323));

            migrationBuilder.AlterColumn<DateTime>(
                name: "OrderDate",
                table: "Order",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 20, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(1997),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 11, 25, 9, 42, 20, 907, DateTimeKind.Local).AddTicks(101));

            migrationBuilder.AddColumn<Guid>(
                name: "ShipperId",
                table: "Order",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "CurrentOrderId",
                table: "Drone",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
