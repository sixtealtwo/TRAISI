using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TRAISI.Migrations
{
    public partial class EmailTemplates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuestionConfigurations_QuestionParts_QuestionPartId1",
                table: "QuestionConfigurations");

            migrationBuilder.DropIndex(
                name: "IX_QuestionConfigurations_QuestionPartId1",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "ConfigurationValueType",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "ConfiguratonType",
                table: "QuestionConfigurations");

            migrationBuilder.DropColumn(
                name: "QuestionPartId1",
                table: "QuestionConfigurations");

            migrationBuilder.RenameColumn(
                name: "PropertyName",
                table: "QuestionConfigurations",
                newName: "Value");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "QuestionConfigurations",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EmailTemplates",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    GroupId = table.Column<int>(nullable: true),
                    HTML = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(maxLength: 256, nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailTemplates_UserGroups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "UserGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOptions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    QuestionPartId = table.Column<int>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionOptions_QuestionParts_QuestionPartId",
                        column: x => x.QuestionPartId,
                        principalTable: "QuestionParts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOptionLabels",
                columns: table => new
                {
                    QuestionOptionId = table.Column<int>(nullable: false),
                    LabelId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOptionLabels", x => new { x.QuestionOptionId, x.LabelId });
                    table.ForeignKey(
                        name: "FK_QuestionOptionLabels_Label_LabelId",
                        column: x => x.LabelId,
                        principalTable: "Label",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuestionOptionLabels_QuestionOptions_QuestionOptionId",
                        column: x => x.QuestionOptionId,
                        principalTable: "QuestionOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailTemplates_GroupId",
                table: "EmailTemplates",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptionLabels_LabelId",
                table: "QuestionOptionLabels",
                column: "LabelId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOptions_QuestionPartId",
                table: "QuestionOptions",
                column: "QuestionPartId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailTemplates");

            migrationBuilder.DropTable(
                name: "QuestionOptionLabels");

            migrationBuilder.DropTable(
                name: "QuestionOptions");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "QuestionConfigurations");

            migrationBuilder.RenameColumn(
                name: "Value",
                table: "QuestionConfigurations",
                newName: "PropertyName");

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

            migrationBuilder.AddColumn<int>(
                name: "QuestionPartId1",
                table: "QuestionConfigurations",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionConfigurations_QuestionPartId1",
                table: "QuestionConfigurations",
                column: "QuestionPartId1");

            migrationBuilder.AddForeignKey(
                name: "FK_QuestionConfigurations_QuestionParts_QuestionPartId1",
                table: "QuestionConfigurations",
                column: "QuestionPartId1",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
