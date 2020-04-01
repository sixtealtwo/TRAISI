using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AlterResponsesTableNaMe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ResponseValues_ResponseValues_OptionListResponseId",
                table: "ResponseValues");

            migrationBuilder.DropForeignKey(
                name: "FK_ResponseValues_SurveyResponses_SurveyResponseId",
                table: "ResponseValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResponseValues",
                table: "ResponseValues");

            migrationBuilder.RenameTable(
                name: "ResponseValues",
                newName: "SurveyResponseValues");

            migrationBuilder.RenameIndex(
                name: "IX_ResponseValues_SurveyResponseId",
                table: "SurveyResponseValues",
                newName: "IX_SurveyResponseValues_SurveyResponseId");

            migrationBuilder.RenameIndex(
                name: "IX_ResponseValues_OptionListResponseId",
                table: "SurveyResponseValues",
                newName: "IX_SurveyResponseValues_OptionListResponseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyResponseValues",
                table: "SurveyResponseValues",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponseValues_SurveyResponseValues_OptionListRespons~",
                table: "SurveyResponseValues",
                column: "OptionListResponseId",
                principalTable: "SurveyResponseValues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponseValues_SurveyResponses_SurveyResponseId",
                table: "SurveyResponseValues",
                column: "SurveyResponseId",
                principalTable: "SurveyResponses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponseValues_SurveyResponseValues_OptionListRespons~",
                table: "SurveyResponseValues");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponseValues_SurveyResponses_SurveyResponseId",
                table: "SurveyResponseValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyResponseValues",
                table: "SurveyResponseValues");

            migrationBuilder.RenameTable(
                name: "SurveyResponseValues",
                newName: "ResponseValues");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponseValues_SurveyResponseId",
                table: "ResponseValues",
                newName: "IX_ResponseValues_SurveyResponseId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponseValues_OptionListResponseId",
                table: "ResponseValues",
                newName: "IX_ResponseValues_OptionListResponseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResponseValues",
                table: "ResponseValues",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ResponseValues_ResponseValues_OptionListResponseId",
                table: "ResponseValues",
                column: "OptionListResponseId",
                principalTable: "ResponseValues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ResponseValues_SurveyResponses_SurveyResponseId",
                table: "ResponseValues",
                column: "SurveyResponseId",
                principalTable: "SurveyResponses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
