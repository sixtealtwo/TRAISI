using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class AddSurveyLogicLabels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Surveys_SurveyLogic_SurveyLogicId",
                table: "Surveys");

            migrationBuilder.DropIndex(
                name: "IX_Surveys_SurveyLogicId",
                table: "Surveys");

            migrationBuilder.DropColumn(
                name: "SurveyLogicId",
                table: "Surveys");

            migrationBuilder.AddColumn<int>(
                name: "SurveyId",
                table: "SurveyLogic",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SurveyLogicLabels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(nullable: true),
                    Language = table.Column<string>(nullable: true),
                    SurveyLogicId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyLogicLabels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyLogicLabels_SurveyLogic_SurveyLogicId",
                        column: x => x.SurveyLogicId,
                        principalTable: "SurveyLogic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogic_SurveyId",
                table: "SurveyLogic",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyLogicLabels_SurveyLogicId",
                table: "SurveyLogicLabels",
                column: "SurveyLogicId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyLogic_Surveys_SurveyId",
                table: "SurveyLogic",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyLogic_Surveys_SurveyId",
                table: "SurveyLogic");

            migrationBuilder.DropTable(
                name: "SurveyLogicLabels");

            migrationBuilder.DropIndex(
                name: "IX_SurveyLogic_SurveyId",
                table: "SurveyLogic");

            migrationBuilder.DropColumn(
                name: "SurveyId",
                table: "SurveyLogic");

            migrationBuilder.AddColumn<int>(
                name: "SurveyLogicId",
                table: "Surveys",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_SurveyLogicId",
                table: "Surveys",
                column: "SurveyLogicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Surveys_SurveyLogic_SurveyLogicId",
                table: "Surveys",
                column: "SurveyLogicId",
                principalTable: "SurveyLogic",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
