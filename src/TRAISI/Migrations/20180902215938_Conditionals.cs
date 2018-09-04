using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class Conditionals : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QuestionConditionals",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    TargetQuestionId = table.Column<int>(nullable: true),
                    SourceQuestionId = table.Column<int>(nullable: true),
                    Condition = table.Column<int>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionConditionals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionConditionals_QuestionParts_SourceQuestionId",
                        column: x => x.SourceQuestionId,
                        principalTable: "QuestionParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionConditionals_QuestionParts_TargetQuestionId",
                        column: x => x.TargetQuestionId,
                        principalTable: "QuestionParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOptionConditionals",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    TargetOptionId = table.Column<int>(nullable: true),
                    SourceQuestionId = table.Column<int>(nullable: true),
                    Condition = table.Column<int>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptionConditionals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionOptionConditionals_QuestionParts_SourceQuestionId",
                        column: x => x.SourceQuestionId,
                        principalTable: "QuestionParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionOptionConditionals_QuestionOptions_TargetOptionId",
                        column: x => x.TargetOptionId,
                        principalTable: "QuestionOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_SourceQuestionId",
                table: "QuestionConditionals",
                column: "SourceQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConditionals_TargetQuestionId",
                table: "QuestionConditionals",
                column: "TargetQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptionConditionals_SourceQuestionId",
                table: "QuestionOptionConditionals",
                column: "SourceQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptionConditionals_TargetOptionId",
                table: "QuestionOptionConditionals",
                column: "TargetOptionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuestionConditionals");

            migrationBuilder.DropTable(
                name: "QuestionOptionConditionals");
        }
    }
}
