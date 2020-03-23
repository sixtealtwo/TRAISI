using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class RemoveColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_TargetQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_TargetQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropColumn(
                name: "SourceQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.DropColumn(
                name: "TargetQuestionId",
                table: "QuestionConditionals");

            migrationBuilder.AddColumn<int>(
                name: "QuestionPartId",
                table: "QuestionConditionals",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionPartId1",
                table: "QuestionConditionals",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_QuestionPartId",
                table: "QuestionConditionals",
                column: "QuestionPartId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_QuestionPartId1",
                table: "QuestionConditionals",
                column: "QuestionPartId1");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_QuestionPartId",
                table: "QuestionConditionals",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_QuestionPartId1",
                table: "QuestionConditionals",
                column: "QuestionPartId1",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_QuestionPartId",
                table: "QuestionConditionals");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_QuestionPartId1",
                table: "QuestionConditionals");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_QuestionPartId",
                table: "QuestionConditionals");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConditionals_QuestionPartId1",
                table: "QuestionConditionals");

            migrationBuilder.DropColumn(
                name: "QuestionPartId",
                table: "QuestionConditionals");

            migrationBuilder.DropColumn(
                name: "QuestionPartId1",
                table: "QuestionConditionals");

            migrationBuilder.AddColumn<int>(
                name: "SourceQuestionId",
                table: "QuestionConditionals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TargetQuestionId",
                table: "QuestionConditionals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_TargetQuestionId",
                table: "QuestionConditionals",
                column: "TargetQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionals_QuestionParts_TargetQuestionId",
                table: "QuestionConditionals",
                column: "TargetQuestionId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
