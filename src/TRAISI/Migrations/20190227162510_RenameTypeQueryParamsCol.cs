using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class RenameTypeQueryParamsCol : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QueryString",
                table: "SurveyAccessRecords");

            migrationBuilder.AddColumn<string>(
                name: "QueryParams",
                table: "SurveyAccessRecords",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QueryParams",
                table: "SurveyAccessRecords");

            migrationBuilder.AddColumn<string>(
                name: "QueryString",
                table: "SurveyAccessRecords",
                nullable: true);
        }
    }
}
