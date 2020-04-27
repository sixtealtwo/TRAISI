using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddSurveyLogicToSurvey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SurveyLogicId",
                table: "Surveys",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_SurveyLogicId",
                table: "Surveys",
                column: "SurveyLogicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Surveys_SurveyLogic_SurveyLogicId",
                table: "Surveys",
                column: "SurveyLogicId",
                principalTable: "SurveyLogic",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Surveys_SurveyLogic_SurveyLogicId",
                table: "Surveys");

            migrationBuilder.DropIndex(
                name: "IX_Surveys_SurveyLogicId",
                table: "Surveys");

            migrationBuilder.DropColumn(
                name: "SurveyLogicId",
                table: "Surveys");
        }
    }
}
