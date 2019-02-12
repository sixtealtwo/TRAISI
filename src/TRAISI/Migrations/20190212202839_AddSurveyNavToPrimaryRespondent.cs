using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddSurveyNavToPrimaryRespondent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SurveyId",
                table: "SurveyRespondents",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyRespondents_SurveyId",
                table: "SurveyRespondents",
                column: "SurveyId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents");

            migrationBuilder.DropIndex(
                name: "IX_SurveyRespondents_SurveyId",
                table: "SurveyRespondents");

            migrationBuilder.DropColumn(
                name: "SurveyId",
                table: "SurveyRespondents");
        }
    }
}
