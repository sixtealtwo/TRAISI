using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class AddSurveyLogicModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SurveyLogic",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Condition = table.Column<int>(nullable: false),
                    SubSurveyLogicId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyLogic", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyLogic_SurveyLogic_SubSurveyLogicId",
                        column: x => x.SubSurveyLogicId,
                        principalTable: "SurveyLogic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SurveyLogicExpressions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(nullable: true),
                    QuestionId = table.Column<int>(nullable: false),
                    Operator = table.Column<int>(nullable: false),
                    SurveyLogicId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyLogicExpressions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyLogicExpressions_QuestionPartViews_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "QuestionPartViews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyLogicExpressions_SurveyLogic_SurveyLogicId",
                        column: x => x.SurveyLogicId,
                        principalTable: "SurveyLogic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogic_SubSurveyLogicId",
                table: "SurveyLogic",
                column: "SubSurveyLogicId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogicExpressions_QuestionId",
                table: "SurveyLogicExpressions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogicExpressions_SurveyLogicId",
                table: "SurveyLogicExpressions",
                column: "SurveyLogicId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SurveyLogicExpressions");

            migrationBuilder.DropTable(
                name: "SurveyLogic");
        }
    }
}
