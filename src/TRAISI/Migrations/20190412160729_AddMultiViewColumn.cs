using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddMultiViewColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isOptional",
                table: "QuestionPartViews",
                newName: "IsOptional");

            migrationBuilder.RenameColumn(
                name: "isHousehold",
                table: "QuestionPartViews",
                newName: "IsHousehold");

            migrationBuilder.AddColumn<bool>(
                name: "IsMultiView",
                table: "QuestionPartViews",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMultiView",
                table: "QuestionPartViews");

            migrationBuilder.RenameColumn(
                name: "IsOptional",
                table: "QuestionPartViews",
                newName: "isOptional");

            migrationBuilder.RenameColumn(
                name: "IsHousehold",
                table: "QuestionPartViews",
                newName: "isHousehold");
        }
    }
}
