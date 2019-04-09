using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class UpdateDeleteBehaviour2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_QuestionParts_QuestionPartId",
                table: "SurveyResponses");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_QuestionParts_QuestionPartId",
                table: "SurveyResponses",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_QuestionParts_QuestionPartId",
                table: "SurveyResponses");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_QuestionParts_QuestionPartId",
                table: "SurveyResponses",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
