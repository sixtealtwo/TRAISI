using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class UpdateModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Time",
                table: "ResponseValues",
                newName: "TimeB");

            migrationBuilder.AddColumn<DateTime>(
                name: "TimeA",
                table: "ResponseValues",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsResourceOnly",
                table: "QuestionConfigurations",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ValueType",
                table: "QuestionConfigurations",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeA",
                table: "ResponseValues");

            migrationBuilder.DropColumn(
                name: "IsResourceOnly",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "ValueType",
                table: "QuestionConfigurations");

            migrationBuilder.RenameColumn(
                name: "TimeB",
                table: "ResponseValues",
                newName: "Time");
        }
    }
}
