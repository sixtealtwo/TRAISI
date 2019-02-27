using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddAccessUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccessUserId",
                table: "SurveyAccessRecords",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyAccessRecords_AccessUserId",
                table: "SurveyAccessRecords",
                column: "AccessUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAccessRecords_AspNetUsers_AccessUserId",
                table: "SurveyAccessRecords",
                column: "AccessUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAccessRecords_AspNetUsers_AccessUserId",
                table: "SurveyAccessRecords");

            migrationBuilder.DropIndex(
                name: "IX_SurveyAccessRecords_AccessUserId",
                table: "SurveyAccessRecords");

            migrationBuilder.DropColumn(
                name: "AccessUserId",
                table: "SurveyAccessRecords");
        }
    }
}
