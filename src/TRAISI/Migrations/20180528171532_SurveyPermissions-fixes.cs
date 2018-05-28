using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class SurveyPermissionsfixes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyPermission_Surveys_SurveyId",
                table: "SurveyPermission");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyPermission_AspNetUsers_UserId",
                table: "SurveyPermission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyPermission",
                table: "SurveyPermission");

            migrationBuilder.RenameTable(
                name: "SurveyPermission",
                newName: "SurveyPermissions");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyPermission_UserId",
                table: "SurveyPermissions",
                newName: "IX_SurveyPermissions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyPermission_SurveyId",
                table: "SurveyPermissions",
                newName: "IX_SurveyPermissions_SurveyId");

            migrationBuilder.AddColumn<string>(
                name: "TestField",
                table: "SurveyPermissions",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyPermissions",
                table: "SurveyPermissions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyPermissions_Surveys_SurveyId",
                table: "SurveyPermissions",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyPermissions_AspNetUsers_UserId",
                table: "SurveyPermissions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyPermissions_Surveys_SurveyId",
                table: "SurveyPermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyPermissions_AspNetUsers_UserId",
                table: "SurveyPermissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyPermissions",
                table: "SurveyPermissions");

            migrationBuilder.DropColumn(
                name: "TestField",
                table: "SurveyPermissions");

            migrationBuilder.RenameTable(
                name: "SurveyPermissions",
                newName: "SurveyPermission");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyPermissions_UserId",
                table: "SurveyPermission",
                newName: "IX_SurveyPermission_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyPermissions_SurveyId",
                table: "SurveyPermission",
                newName: "IX_SurveyPermission_SurveyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyPermission",
                table: "SurveyPermission",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyPermission_Surveys_SurveyId",
                table: "SurveyPermission",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyPermission_AspNetUsers_UserId",
                table: "SurveyPermission",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
