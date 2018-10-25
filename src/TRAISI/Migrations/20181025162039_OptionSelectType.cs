using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class OptionSelectType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OptionSelectResponse_Value",
                table: "ResponseValues",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TimelineResponse_Name",
                table: "ResponseValues",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OptionSelectResponse_Value",
                table: "ResponseValues");

            migrationBuilder.DropColumn(
                name: "TimelineResponse_Name",
                table: "ResponseValues");
        }
    }
}
