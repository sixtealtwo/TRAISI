using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class SurveyCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Surveys",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<string>(
                name: "RespondentId",
                table: "SurveyResponse",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyResponse_RespondentId",
                table: "SurveyResponse",
                column: "RespondentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponse_AspNetUsers_RespondentId",
                table: "SurveyResponse",
                column: "RespondentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponse_AspNetUsers_RespondentId",
                table: "SurveyResponse");

            migrationBuilder.DropIndex(
                name: "IX_SurveyResponse_RespondentId",
                table: "SurveyResponse");

            migrationBuilder.DropColumn(
                name: "RespondentId",
                table: "SurveyResponse");

            migrationBuilder.AlterColumn<int>(
                name: "Code",
                table: "Surveys",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
