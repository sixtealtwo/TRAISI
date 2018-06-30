using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class RemovingPrimaryRespondentFromShortCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionParts_QuestionConfigurations_QuestionConfigurationId",
                table: "QuestionParts");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionParts_SurveyView_SurveyViewId",
                table: "QuestionParts");

            migrationBuilder.DropForeignKey(
                name: "FK_Shortcode_PrimaryRespondent_RespondentId",
                table: "Shortcode");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyView_Surveys_SurveyId",
                table: "SurveyView");

            migrationBuilder.DropTable(
                name: "PrimaryRespondent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyView",
                table: "SurveyView");

            migrationBuilder.DropIndex(
                name: "IX_Shortcode_RespondentId",
                table: "Shortcode");

            migrationBuilder.DropIndex(
                name: "IX_QuestionParts_QuestionConfigurationId",
                table: "QuestionParts");

            migrationBuilder.DropColumn(
                name: "RespondentId",
                table: "Shortcode");

            migrationBuilder.DropColumn(
                name: "QuestionConfigurationId",
                table: "QuestionParts");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "QuestionConfigurations");

            migrationBuilder.RenameTable(
                name: "SurveyView",
                newName: "SurveyViews");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyView_SurveyId",
                table: "SurveyViews",
                newName: "IX_SurveyViews_SurveyId");

            migrationBuilder.AddColumn<bool>(
                name: "IsGroupQuestion",
                table: "QuestionParts",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ConfigurationValueType",
                table: "QuestionConfigurations",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ConfiguratonType",
                table: "QuestionConfigurations",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PropertyName",
                table: "QuestionConfigurations",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionPartId",
                table: "QuestionConfigurations",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionPartId1",
                table: "QuestionConfigurations",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyViews",
                table: "SurveyViews",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ResponseValues",
                columns: table => new
                {
                    Value = table.Column<double>(nullable: true),
                    IntegerResponse_Value = table.Column<int>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Latitude = table.Column<double>(nullable: true),
                    Longitude = table.Column<double>(nullable: true),
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    ResponseType = table.Column<int>(nullable: false),
                    StringResponse_Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResponseValues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SurveyResponse",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    QuestionPartId = table.Column<int>(nullable: true),
                    ResponseValueId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyResponse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurveyResponse_QuestionParts_QuestionPartId",
                        column: x => x.QuestionPartId,
                        principalTable: "QuestionParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SurveyResponse_ResponseValues_ResponseValueId",
                        column: x => x.ResponseValueId,
                        principalTable: "ResponseValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConfigurations_QuestionPartId",
                table: "QuestionConfigurations",
                column: "QuestionPartId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConfigurations_QuestionPartId1",
                table: "QuestionConfigurations",
                column: "QuestionPartId1");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyResponse_QuestionPartId",
                table: "SurveyResponse",
                column: "QuestionPartId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyResponse_ResponseValueId",
                table: "SurveyResponse",
                column: "ResponseValueId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConfigurations_QuestionParts_QuestionPartId",
                table: "QuestionConfigurations",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConfigurations_QuestionParts_QuestionPartId1",
                table: "QuestionConfigurations",
                column: "QuestionPartId1",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionParts_SurveyViews_SurveyViewId",
                table: "QuestionParts",
                column: "SurveyViewId",
                principalTable: "SurveyViews",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyViews_Surveys_SurveyId",
                table: "SurveyViews",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConfigurations_QuestionParts_QuestionPartId",
                table: "QuestionConfigurations");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConfigurations_QuestionParts_QuestionPartId1",
                table: "QuestionConfigurations");

            migrationBuilder.DropForeignKey(
                name: "FK_QuestionParts_SurveyViews_SurveyViewId",
                table: "QuestionParts");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyViews_Surveys_SurveyId",
                table: "SurveyViews");

            migrationBuilder.DropTable(
                name: "SurveyResponse");

            migrationBuilder.DropTable(
                name: "ResponseValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyViews",
                table: "SurveyViews");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConfigurations_QuestionPartId",
                table: "QuestionConfigurations");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConfigurations_QuestionPartId1",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "IsGroupQuestion",
                table: "QuestionParts");

            migrationBuilder.DropColumn(
                name: "ConfigurationValueType",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "ConfiguratonType",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "PropertyName",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "QuestionPartId",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "QuestionPartId1",
                table: "QuestionConfigurations");

            migrationBuilder.RenameTable(
                name: "SurveyViews",
                newName: "SurveyView");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyViews_SurveyId",
                table: "SurveyView",
                newName: "IX_SurveyView_SurveyId");

            migrationBuilder.AddColumn<int>(
                name: "RespondentId",
                table: "Shortcode",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionConfigurationId",
                table: "QuestionParts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "QuestionConfigurations",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyView",
                table: "SurveyView",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "PrimaryRespondent",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrimaryRespondent", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shortcode_RespondentId",
                table: "Shortcode",
                column: "RespondentId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionParts_QuestionConfigurationId",
                table: "QuestionParts",
                column: "QuestionConfigurationId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionParts_QuestionConfigurations_QuestionConfigurationId",
                table: "QuestionParts",
                column: "QuestionConfigurationId",
                principalTable: "QuestionConfigurations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionParts_SurveyView_SurveyViewId",
                table: "QuestionParts",
                column: "SurveyViewId",
                principalTable: "SurveyView",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcode_PrimaryRespondent_RespondentId",
                table: "Shortcode",
                column: "RespondentId",
                principalTable: "PrimaryRespondent",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyView_Surveys_SurveyId",
                table: "SurveyView",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
