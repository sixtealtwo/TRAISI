using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class OptionFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionOptionConditionals_QuestionOptions_TargetOptionId1",
                table: "QuestionOptionConditionals");

            migrationBuilder.DropIndex(
                name: "IX_QuestionOptionConditionals_TargetOptionId1",
                table: "QuestionOptionConditionals");

            migrationBuilder.DropColumn(
                name: "TargetOptionId1",
                table: "QuestionOptionConditionals");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TargetOptionId1",
                table: "QuestionOptionConditionals",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptionConditionals_TargetOptionId1",
                table: "QuestionOptionConditionals",
                column: "TargetOptionId1");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionOptionConditionals_QuestionOptions_TargetOptionId1",
                table: "QuestionOptionConditionals",
                column: "TargetOptionId1",
                principalTable: "QuestionOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
