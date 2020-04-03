using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddPrimaryRespondentNavToSubRespondent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PrimaryRespondentId",
                table: "SurveyRespondents",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyRespondents_PrimaryRespondentId",
                table: "SurveyRespondents",
                column: "PrimaryRespondentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondents_SurveyRespondents_PrimaryRespondentId",
                table: "SurveyRespondents",
                column: "PrimaryRespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_SurveyRespondents_PrimaryRespondentId",
                table: "SurveyRespondents");

            migrationBuilder.DropIndex(
                name: "IX_SurveyRespondents_PrimaryRespondentId",
                table: "SurveyRespondents");

            migrationBuilder.DropColumn(
                name: "PrimaryRespondentId",
                table: "SurveyRespondents");
        }
    }
}
