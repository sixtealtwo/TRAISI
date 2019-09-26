using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class ChangeAccessRecords : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAccessRecords_SurveyRespondents_PrimaryRespondentId",
                table: "SurveyAccessRecords");

            migrationBuilder.RenameColumn(
                name: "PrimaryRespondentId",
                table: "SurveyAccessRecords",
                newName: "RespondentId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyAccessRecords_PrimaryRespondentId",
                table: "SurveyAccessRecords",
                newName: "IX_SurveyAccessRecords_RespondentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAccessRecords_SurveyRespondents_RespondentId",
                table: "SurveyAccessRecords",
                column: "RespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAccessRecords_SurveyRespondents_RespondentId",
                table: "SurveyAccessRecords");

            migrationBuilder.RenameColumn(
                name: "RespondentId",
                table: "SurveyAccessRecords",
                newName: "PrimaryRespondentId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyAccessRecords_RespondentId",
                table: "SurveyAccessRecords",
                newName: "IX_SurveyAccessRecords_PrimaryRespondentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAccessRecords_SurveyRespondents_PrimaryRespondentId",
                table: "SurveyAccessRecords",
                column: "PrimaryRespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
