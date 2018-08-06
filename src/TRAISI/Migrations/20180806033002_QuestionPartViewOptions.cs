using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class QuestionPartViewOptions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isHousehold",
                table: "QuestionPartViews",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isOptional",
                table: "QuestionPartViews",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isRepeat",
                table: "QuestionPartViews",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isHousehold",
                table: "QuestionPartViews");

            migrationBuilder.DropColumn(
                name: "isOptional",
                table: "QuestionPartViews");

            migrationBuilder.DropColumn(
                name: "isRepeat",
                table: "QuestionPartViews");
        }
    }
}
