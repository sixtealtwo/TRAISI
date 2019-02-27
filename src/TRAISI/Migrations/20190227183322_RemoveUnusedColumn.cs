using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class RemoveUnusedColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResponseValueId",
                table: "SurveyResponses");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResponseValueId",
                table: "SurveyResponses",
                nullable: false,
                defaultValue: 0);
        }
    }
}
