using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddPrimaryRespondentToSurveyGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyRespondentGroups_GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                column: "GroupPrimaryRespondentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups",
                column: "GroupPrimaryRespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups");

            migrationBuilder.DropIndex(
                name: "IX_SurveyRespondentGroups_GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups");

            migrationBuilder.DropColumn(
                name: "GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups");
        }
    }
}
