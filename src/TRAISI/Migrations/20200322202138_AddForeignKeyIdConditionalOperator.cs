using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class AddForeignKeyIdConditionalOperator : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionalGroup_QuestionParts_TargetQuestionId",
                table: "QuestionConditionalGroup");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionalOperator_QuestionConditionals_LhsId",
                table: "QuestionConditionalOperator");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionalOperator_QuestionConditionalGroup_Questi~",
                table: "QuestionConditionalOperator");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConditionalOperator_QuestionConditionals_RhsId",
                table: "QuestionConditionalOperator");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionConditionalOperator",
                table: "QuestionConditionalOperator");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionConditionalGroup",
                table: "QuestionConditionalGroup");

            migrationBuilder.RenameTable(
                name: "QuestionConditionalOperator",
                newName: "QuestionCondtionalOperators");

            migrationBuilder.RenameTable(
                name: "QuestionConditionalGroup",
                newName: "QuestionCondtionalGroups");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionConditionalOperator_RhsId",
                table: "QuestionCondtionalOperators",
                newName: "IX_QuestionCondtionalOperators_RhsId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionConditionalOperator_QuestionConditionalGroupId",
                table: "QuestionCondtionalOperators",
                newName: "IX_QuestionCondtionalOperators_QuestionConditionalGroupId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionConditionalOperator_LhsId",
                table: "QuestionCondtionalOperators",
                newName: "IX_QuestionCondtionalOperators_LhsId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionConditionalGroup_TargetQuestionId",
                table: "QuestionCondtionalGroups",
                newName: "IX_QuestionCondtionalGroups_TargetQuestionId");

            migrationBuilder.AddColumn<int>(
                name: "TargetQuestionId",
                table: "QuestionCondtionalOperators",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionCondtionalOperators",
                table: "QuestionCondtionalOperators",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionCondtionalGroups",
                table: "QuestionCondtionalGroups",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_TargetQuestionId",
                table: "QuestionCondtionalOperators",
                column: "TargetQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalGroups_QuestionPartViews_TargetQuestionId",
                table: "QuestionCondtionalGroups",
                column: "TargetQuestionId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_LhsId",
                table: "QuestionCondtionalOperators",
                column: "LhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionCondtionalGroups_Questi~",
                table: "QuestionCondtionalOperators",
                column: "QuestionConditionalGroupId",
                principalTable: "QuestionCondtionalGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_RhsId",
                table: "QuestionCondtionalOperators",
                column: "RhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionPartViews_TargetQuestio~",
                table: "QuestionCondtionalOperators",
                column: "TargetQuestionId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalGroups_QuestionPartViews_TargetQuestionId",
                table: "QuestionCondtionalGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_LhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionCondtionalGroups_Questi~",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionConditionals_RhsId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionPartViews_TargetQuestio~",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionCondtionalOperators",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_TargetQuestionId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuestionCondtionalGroups",
                table: "QuestionCondtionalGroups");

            migrationBuilder.DropColumn(
                name: "TargetQuestionId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.RenameTable(
                name: "QuestionCondtionalOperators",
                newName: "QuestionConditionalOperator");

            migrationBuilder.RenameTable(
                name: "QuestionCondtionalGroups",
                newName: "QuestionConditionalGroup");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionCondtionalOperators_RhsId",
                table: "QuestionConditionalOperator",
                newName: "IX_QuestionConditionalOperator_RhsId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionCondtionalOperators_QuestionConditionalGroupId",
                table: "QuestionConditionalOperator",
                newName: "IX_QuestionConditionalOperator_QuestionConditionalGroupId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionCondtionalOperators_LhsId",
                table: "QuestionConditionalOperator",
                newName: "IX_QuestionConditionalOperator_LhsId");

            migrationBuilder.RenameIndex(
                name: "IX_QuestionCondtionalGroups_TargetQuestionId",
                table: "QuestionConditionalGroup",
                newName: "IX_QuestionConditionalGroup_TargetQuestionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionConditionalOperator",
                table: "QuestionConditionalOperator",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuestionConditionalGroup",
                table: "QuestionConditionalGroup",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionalGroup_QuestionParts_TargetQuestionId",
                table: "QuestionConditionalGroup",
                column: "TargetQuestionId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionalOperator_QuestionConditionals_LhsId",
                table: "QuestionConditionalOperator",
                column: "LhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionalOperator_QuestionConditionalGroup_Questi~",
                table: "QuestionConditionalOperator",
                column: "QuestionConditionalGroupId",
                principalTable: "QuestionConditionalGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConditionalOperator_QuestionConditionals_RhsId",
                table: "QuestionConditionalOperator",
                column: "RhsId",
                principalTable: "QuestionConditionals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
