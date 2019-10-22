using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class RemoteIp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RemoteIpAddress",
                table: "SurveyAccessRecords",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RemoteIpAddress",
                table: "SurveyAccessRecords");
        }
    }
}
