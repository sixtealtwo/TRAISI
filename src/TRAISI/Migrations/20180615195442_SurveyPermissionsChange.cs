using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class SurveyPermissionsChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyPermissions_Surveys_SurveyId",
                table: "SurveyPermissions");

            migrationBuilder.AlterColumn<int>(
                name: "SurveyId",
                table: "SurveyPermissions",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyPermissions_Surveys_SurveyId",
                table: "SurveyPermissions",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyPermissions_Surveys_SurveyId",
                table: "SurveyPermissions");

            migrationBuilder.AlterColumn<int>(
                name: "SurveyId",
                table: "SurveyPermissions",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyPermissions_Surveys_SurveyId",
                table: "SurveyPermissions",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
