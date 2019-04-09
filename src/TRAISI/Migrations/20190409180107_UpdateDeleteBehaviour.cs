using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class UpdateDeleteBehaviour : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
