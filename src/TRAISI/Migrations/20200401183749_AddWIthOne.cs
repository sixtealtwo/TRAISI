using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddWIthOne : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups");

            migrationBuilder.DropIndex(
                name: "IX_SurveyRespondentGroups_GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups");

            migrationBuilder.AlterColumn<int>(
                name: "GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyRespondentGroups_GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                column: "GroupPrimaryRespondentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups",
                column: "GroupPrimaryRespondentId",
                principalTable: "SurveyRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyRespondentGroups_SurveyRespondents_GroupPrimaryRespon~",
                table: "SurveyRespondentGroups");

            migrationBuilder.DropIndex(
                name: "IX_SurveyRespondentGroups_GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups");

            migrationBuilder.AlterColumn<int>(
                name: "GroupPrimaryRespondentId",
                table: "SurveyRespondentGroups",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int));

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
    }
}
