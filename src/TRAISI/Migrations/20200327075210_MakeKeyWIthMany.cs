using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class MakeKeyWIthMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators",
                column: "LhsId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators",
                column: "RhsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators",
                column: "LhsId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators",
                column: "RhsId",
                unique: true);
        }
    }
}
