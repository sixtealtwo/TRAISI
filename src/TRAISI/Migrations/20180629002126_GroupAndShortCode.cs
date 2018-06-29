using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class GroupAndShortCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApiKeys_UserGroups_GroupId",
                table: "ApiKeys");

            migrationBuilder.DropIndex(
                name: "IX_ApiKeys_GroupId",
                table: "ApiKeys");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "ApiKeys");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "ApiKeys",
                nullable: false,
                oldClrType: typeof(int))
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.CreateTable(
                name: "GroupCode",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Code = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    IsTest = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    SurveyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupCode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupCode_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateTable(
                name: "Shortcode",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Code = table.Column<string>(nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    GroupCodeId = table.Column<int>(nullable: true),
                    IsTest = table.Column<bool>(nullable: false),
                    RespondentId = table.Column<int>(nullable: true),
                    SurveyId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shortcode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shortcode_GroupCode_GroupCodeId",
                        column: x => x.GroupCodeId,
                        principalTable: "GroupCode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Shortcode_PrimaryRespondent_RespondentId",
                        column: x => x.RespondentId,
                        principalTable: "PrimaryRespondent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Shortcode_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupCode_SurveyId",
                table: "GroupCode",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_Shortcode_GroupCodeId",
                table: "Shortcode",
                column: "GroupCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_Shortcode_RespondentId",
                table: "Shortcode",
                column: "RespondentId");

            migrationBuilder.CreateIndex(
                name: "IX_Shortcode_SurveyId",
                table: "Shortcode",
                column: "SurveyId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApiKeys_UserGroups_Id",
                table: "ApiKeys",
                column: "Id",
                principalTable: "UserGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApiKeys_UserGroups_Id",
                table: "ApiKeys");

            migrationBuilder.DropTable(
                name: "Shortcode");

            migrationBuilder.DropTable(
                name: "GroupCode");

            migrationBuilder.DropTable(
                name: "PrimaryRespondent");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "ApiKeys",
                nullable: false,
                oldClrType: typeof(int))
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "ApiKeys",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApiKeys_GroupId",
                table: "ApiKeys",
                column: "GroupId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ApiKeys_UserGroups_GroupId",
                table: "ApiKeys",
                column: "GroupId",
                principalTable: "UserGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
