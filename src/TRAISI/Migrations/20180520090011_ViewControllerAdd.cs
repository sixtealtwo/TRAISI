using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class ViewControllerAdd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "QuestionParts",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionPartId",
                table: "Label",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "AppSurveys",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Label_QuestionPartId",
                table: "Label",
                column: "QuestionPartId");

            migrationBuilder.AddForeignKey(
                name: "FK_Label_QuestionParts_QuestionPartId",
                table: "Label",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Label_QuestionParts_QuestionPartId",
                table: "Label");

            migrationBuilder.DropIndex(
                name: "IX_Label_QuestionPartId",
                table: "Label");

            migrationBuilder.DropColumn(
                name: "Text",
                table: "QuestionParts");

            migrationBuilder.DropColumn(
                name: "QuestionPartId",
                table: "Label");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "AppSurveys");
        }
    }
}
