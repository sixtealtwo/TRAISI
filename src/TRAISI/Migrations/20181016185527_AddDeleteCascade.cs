using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddDeleteCascade : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ResponseValues_SurveyResponses_SurveyResponseId",
                table: "ResponseValues");

            migrationBuilder.AddForeignKey(
                name: "FK_ResponseValues_SurveyResponses_SurveyResponseId",
                table: "ResponseValues",
                column: "SurveyResponseId",
                principalTable: "SurveyResponses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ResponseValues_SurveyResponses_SurveyResponseId",
                table: "ResponseValues");

            migrationBuilder.AddForeignKey(
                name: "FK_ResponseValues_SurveyResponses_SurveyResponseId",
                table: "ResponseValues",
                column: "SurveyResponseId",
                principalTable: "SurveyResponses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
