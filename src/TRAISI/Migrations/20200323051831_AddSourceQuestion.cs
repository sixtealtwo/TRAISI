using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddSourceQuestion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SourceQuestionId",
                table: "QuestionConditionals",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionals_QuestionPartViews_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionals_QuestionPartViews_SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropColumn(
                name: "SourceQuestionId",
                table: "QuestionConditionals");
        }
    }
}
