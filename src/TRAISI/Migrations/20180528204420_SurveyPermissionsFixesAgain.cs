using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class SurveyPermissionsFixesAgain : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermissionCode",
                table: "SurveyPermissions");

            migrationBuilder.DropColumn(
                name: "TestField",
                table: "SurveyPermissions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PermissionCode",
                table: "SurveyPermissions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TestField",
                table: "SurveyPermissions",
                nullable: true);
        }
    }
}
