using Microsoft.EntityFrameworkCore.Migrations;

namespace Traisi.Migrations
{
    public partial class UpdateDeleteSurveyLogic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogic_QuestionPartViews_QuestionId",
                table: "SurveyLogic");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogic_QuestionPartViews_QuestionId",
                table: "SurveyLogic",
                column: "QuestionId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogic_QuestionPartViews_QuestionId",
                table: "SurveyLogic");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogic_QuestionPartViews_QuestionId",
                table: "SurveyLogic",
                column: "QuestionId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
