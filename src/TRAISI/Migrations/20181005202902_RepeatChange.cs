using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class RepeatChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isRepeat",
                table: "QuestionPartViews");

            migrationBuilder.AddColumn<string>(
                name: "RepeatSourceQuestionName",
                table: "QuestionPartViews",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RepeatSourceQuestionName",
                table: "QuestionPartViews");

            migrationBuilder.AddColumn<bool>(
                name: "isRepeat",
                table: "QuestionPartViews",
                nullable: false,
                defaultValue: false);
        }
    }
}
