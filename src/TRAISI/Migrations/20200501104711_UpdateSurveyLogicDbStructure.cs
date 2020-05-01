using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class UpdateSurveyLogicDbStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogic_SurveyLogic_SubSurveyLogicId",
                table: "SurveyLogic");

            migrationBuilder.DropTable(
                name: "SurveyLogicExpressions");

            migrationBuilder.DropIndex(
                name: "IX_SurveyLogic_SubSurveyLogicId",
                table: "SurveyLogic");

            migrationBuilder.DropColumn(
                name: "SubSurveyLogicId",
                table: "SurveyLogic");

            migrationBuilder.AlterColumn<int>(
                name: "Condition",
                table: "SurveyLogic",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "Operator",
                table: "SurveyLogic",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionId",
                table: "SurveyLogic",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SurveyLogicId",
                table: "SurveyLogic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "SurveyLogic",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogic_QuestionId",
                table: "SurveyLogic",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogic_SurveyLogicId",
                table: "SurveyLogic",
                column: "SurveyLogicId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogic_QuestionPartViews_QuestionId",
                table: "SurveyLogic",
                column: "QuestionId",
                principalTable: "QuestionPartViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogic_SurveyLogic_SurveyLogicId",
                table: "SurveyLogic",
                column: "SurveyLogicId",
                principalTable: "SurveyLogic",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogic_QuestionPartViews_QuestionId",
                table: "SurveyLogic");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogic_SurveyLogic_SurveyLogicId",
                table: "SurveyLogic");

            migrationBuilder.DropIndex(
                name: "IX_SurveyLogic_QuestionId",
                table: "SurveyLogic");

            migrationBuilder.DropIndex(
                name: "IX_SurveyLogic_SurveyLogicId",
                table: "SurveyLogic");

            migrationBuilder.DropColumn(
                name: "Operator",
                table: "SurveyLogic");

            migrationBuilder.DropColumn(
                name: "QuestionId",
                table: "SurveyLogic");

            migrationBuilder.DropColumn(
                name: "SurveyLogicId",
                table: "SurveyLogic");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "SurveyLogic");

            migrationBuilder.AlterColumn<int>(
                name: "Condition",
                table: "SurveyLogic",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubSurveyLogicId",
                table: "SurveyLogic",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SurveyLogicExpressions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Operator = table.Column<int>(type: "integer", nullable: false),
                    QuestionId = table.Column<int>(type: "integer", nullable: false),
                    SurveyLogicId = table.Column<int>(type: "integer", nullable: true),
                    Value = table.Column<string>(type: "text", nullable: true)
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
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogic_SurveyLogic_SubSurveyLogicId",
                table: "SurveyLogic",
                column: "SubSurveyLogicId",
                principalTable: "SurveyLogic",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
