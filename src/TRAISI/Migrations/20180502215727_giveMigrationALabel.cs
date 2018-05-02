using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class giveMigrationALabel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppSurveys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    CreatedBy = table.Column<string>(maxLength: 256, nullable: true),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    DefaultLanguage = table.Column<string>(nullable: true),
                    EndAt = table.Column<DateTime>(nullable: false),
                    Group = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    IsOpen = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Owner = table.Column<string>(nullable: true),
                    RejectionLink = table.Column<string>(nullable: true),
                    StartAt = table.Column<DateTime>(nullable: false),
                    StyleTemplate = table.Column<string>(nullable: true),
                    SuccessLink = table.Column<string>(nullable: true),
                    UpdatedBy = table.Column<string>(maxLength: 256, nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSurveys", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppSurveys_Name",
                table: "AppSurveys",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppSurveys");
        }
    }
}
