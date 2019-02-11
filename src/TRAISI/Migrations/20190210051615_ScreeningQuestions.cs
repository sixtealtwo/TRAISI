using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class ScreeningQuestions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScreeningQuestionsLabels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: true),
                    UpdatedBy = table.Column<string>(maxLength: 256, nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    Value = table.Column<string>(nullable: true),
                    Language = table.Column<string>(nullable: true),
                    SurveyViewId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScreeningQuestionsLabels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScreeningQuestionsLabels_SurveyViews_SurveyViewId",
                        column: x => x.SurveyViewId,
                        principalTable: "SurveyViews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ScreeningQuestionsLabels_SurveyViewId",
                table: "ScreeningQuestionsLabels",
                column: "SurveyViewId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScreeningQuestionsLabels");
        }
    }
}
