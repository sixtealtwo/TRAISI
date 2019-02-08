using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class DbUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SurveyAccessRecordId",
                table: "SurveyResponses",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AccessDateTime",
                table: "SurveyAccessRecords",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_SurveyResponses_SurveyAccessRecordId",
                table: "SurveyResponses",
                column: "SurveyAccessRecordId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_SurveyAccessRecords_SurveyAccessRecordId",
                table: "SurveyResponses",
                column: "SurveyAccessRecordId",
                principalTable: "SurveyAccessRecords",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_SurveyAccessRecords_SurveyAccessRecordId",
                table: "SurveyResponses");

            migrationBuilder.DropIndex(
                name: "IX_SurveyResponses_SurveyAccessRecordId",
                table: "SurveyResponses");

            migrationBuilder.DropColumn(
                name: "SurveyAccessRecordId",
                table: "SurveyResponses");

            migrationBuilder.DropColumn(
                name: "AccessDateTime",
                table: "SurveyAccessRecords");
        }
    }
}
