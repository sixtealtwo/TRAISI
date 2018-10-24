using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class CATIQPVLink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CATIDependentId",
                table: "QuestionPartViews",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionPartViews_CATIDependentId",
                table: "QuestionPartViews",
                column: "CATIDependentId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionPartViews_QuestionPartViews_CATIDependentId",
                table: "QuestionPartViews",
                column: "CATIDependentId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionPartViews_QuestionPartViews_CATIDependentId",
                table: "QuestionPartViews");

            migrationBuilder.DropIndex(
                name: "IX_QuestionPartViews_CATIDependentId",
                table: "QuestionPartViews");

            migrationBuilder.DropColumn(
                name: "CATIDependentId",
                table: "QuestionPartViews");
        }
    }
}
