using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class PrimaryRespondentHasGroupcode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupcodeId",
                table: "SurveyRespondents",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyRespondents_GroupcodeId",
                table: "SurveyRespondents",
                column: "GroupcodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondents_GroupCodes_GroupcodeId",
                table: "SurveyRespondents",
                column: "GroupcodeId",
                principalTable: "GroupCodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondents_GroupCodes_GroupcodeId",
                table: "SurveyRespondents");

            migrationBuilder.DropIndex(
                name: "IX_SurveyRespondents_GroupcodeId",
                table: "SurveyRespondents");

            migrationBuilder.DropColumn(
                name: "GroupcodeId",
                table: "SurveyRespondents");
        }
    }
}
