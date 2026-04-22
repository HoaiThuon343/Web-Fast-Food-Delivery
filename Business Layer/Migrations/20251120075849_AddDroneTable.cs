using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Business_Layer.Migrations
{
    public partial class AddDroneTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ShippedDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 11, 25, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2325),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 20, 7, 41, 40, 851, DateTimeKind.Local).AddTicks(1370));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequiredDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2025, 11, 23, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2221),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2024, 7, 18, 7, 41, 40, 851, DateTimeKind.Local).AddTicks(1169));

            migrationBuilder.AlterColumn<DateTime>(
                name: "OrderDate",
                table: "Order",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2025, 11, 20, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(1997),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2024, 7, 15, 7, 41, 40, 851, DateTimeKind.Local).AddTicks(905));

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "AspNetUsers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateTable(
                name: "Drone",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BatteryLevel = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CurrentLat = table.Column<double>(type: "float", nullable: false),
                    CurrentLng = table.Column<double>(type: "float", nullable: false),
                    CurrentOrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drone", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Drone_Order_CurrentOrderId",
                        column: x => x.CurrentOrderId,
                        principalTable: "Order",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Drone_CurrentOrderId",
                table: "Drone",
                column: "CurrentOrderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Drone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ShippedDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 20, 7, 41, 40, 851, DateTimeKind.Local).AddTicks(1370),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 11, 25, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2325));

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequiredDate",
                table: "Order",
                type: "datetime2",
                nullable: true,
                defaultValue: new DateTime(2024, 7, 18, 7, 41, 40, 851, DateTimeKind.Local).AddTicks(1169),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true,
                oldDefaultValue: new DateTime(2025, 11, 23, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(2221));

            migrationBuilder.AlterColumn<DateTime>(
                name: "OrderDate",
                table: "Order",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2024, 7, 15, 7, 41, 40, 851, DateTimeKind.Local).AddTicks(905),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValue: new DateTime(2025, 11, 20, 14, 58, 49, 206, DateTimeKind.Local).AddTicks(1997));

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "AspNetUsers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
