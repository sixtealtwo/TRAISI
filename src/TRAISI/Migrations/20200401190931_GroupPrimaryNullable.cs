using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class GroupPrimaryNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents");

            migrationBuilder.AlterColumn<int>(
                name: "GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups",
                column: "GroupPrimaryRespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

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
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents");

            migrationBuilder.AlterColumn<int>(
                name: "GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups",
                column: "GroupPrimaryRespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondents_Surveys_SurveyId",
                table: "SurveyRespondents",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
