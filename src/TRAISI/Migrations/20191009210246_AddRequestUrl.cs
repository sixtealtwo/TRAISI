using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddRequestUrl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestUrl",
                table: "SurveyAccessRecords",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestUrl",
                table: "SurveyAccessRecords");
        }
    }
}
