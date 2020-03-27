using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class RemoveConditionalGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionCondtionalGroups_Questi~",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropTable(
                name: "QuestionCondtionalGroups");

            migrationBuilder.DropIndex(
                name: "IX_QuestionCondtionalOperators_QuestionConditionalGroupId",
                table: "QuestionCondtionalOperators");

            migrationBuilder.DropColumn(
                name: "QuestionConditionalGroupId",
                table: "QuestionCondtionalOperators");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuestionConditionalGroupId",
                table: "QuestionCondtionalOperators",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "QuestionCondtionalGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TargetQuestionId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionCondtionalGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionCondtionalGroups_QuestionPartViews_TargetQuestionId",
                        column: x => x.TargetQuestionId,
                        principalTable: "QuestionPartViews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalOperators_QuestionConditionalGroupId",
                table: "QuestionCondtionalOperators",
                column: "QuestionConditionalGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionCondtionalGroups_TargetQuestionId",
                table: "QuestionCondtionalGroups",
                column: "TargetQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionCondtionalOperators_QuestionCondtionalGroups_Questi~",
                table: "QuestionCondtionalOperators",
                column: "QuestionConditionalGroupId",
                principalTable: "QuestionCondtionalGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
