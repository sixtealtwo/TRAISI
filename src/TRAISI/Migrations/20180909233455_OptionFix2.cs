using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class OptionFix2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TargetOptionId",
                table: "QuestionOptionConditionals",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TargetQuestionId",
                table: "QuestionOptionConditionals",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetQuestionId",
                table: "QuestionOptionConditionals");

            migrationBuilder.AlterColumn<int>(
                name: "TargetOptionId",
                table: "QuestionOptionConditionals",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
