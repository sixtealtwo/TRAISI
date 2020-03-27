using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddCascadeDeleteForConditionals : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.AlterColumn<int>(
                name: "RhsId",
                table: "QuestionCondtionalOperators",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LhsId",
                table: "QuestionCondtionalOperators",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_LhsId",
                table: "QuestionCondtionalOperators",
                column: "LhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_RhsId",
                table: "QuestionCondtionalOperators",
                column: "RhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.AlterColumn<int>(
                name: "RhsId",
                table: "QuestionCondtionalOperators",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "LhsId",
                table: "QuestionCondtionalOperators",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionCondtionalOperators",
                column: "LhsId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionCondtionalOperators",
                column: "RhsId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_LhsId",
                table: "QuestionCondtionalOperators",
                column: "LhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_RhsId",
                table: "QuestionCondtionalOperators",
                column: "RhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
