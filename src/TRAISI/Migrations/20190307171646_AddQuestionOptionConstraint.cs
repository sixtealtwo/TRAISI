using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddQuestionOptionConstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptions_Code_QuestionPartParentId",
                table: "QuestionOptions",
                columns: new[] { "Code", "QuestionPartParentId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_QuestionOptions_Code_QuestionPartParentId",
                table: "QuestionOptions");
        }
    }
}
