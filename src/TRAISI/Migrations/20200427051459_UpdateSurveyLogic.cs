using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class UpdateSurveyLogic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogicExpressions_SurveyLogic_SurveyLogicId",
                table: "SurveyLogicExpressions");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogicExpressions_SurveyLogic_SurveyLogicId",
                table: "SurveyLogicExpressions",
                column: "SurveyLogicId",
                principalTable: "SurveyLogic",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogicExpressions_SurveyLogic_SurveyLogicId",
                table: "SurveyLogicExpressions");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogicExpressions_SurveyLogic_SurveyLogicId",
                table: "SurveyLogicExpressions",
                column: "SurveyLogicId",
                principalTable: "SurveyLogic",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
