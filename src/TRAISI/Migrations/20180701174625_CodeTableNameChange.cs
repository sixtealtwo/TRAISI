using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class CodeTableNameChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupCode_Surveys_SurveyId",
                table: "GroupCode");

            migrationBuilder.DropForeignKey(
                name: "FK_Shortcode_GroupCode_GroupCodeId",
                table: "Shortcode");

            migrationBuilder.DropForeignKey(
                name: "FK_Shortcode_Surveys_SurveyId",
                table: "Shortcode");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shortcode",
                table: "Shortcode");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupCode",
                table: "GroupCode");

            migrationBuilder.RenameTable(
                name: "Shortcode",
                newName: "Shortcodes");

            migrationBuilder.RenameTable(
                name: "GroupCode",
                newName: "GroupCodes");

            migrationBuilder.RenameIndex(
                name: "IX_Shortcode_SurveyId",
                table: "Shortcodes",
                newName: "IX_Shortcodes_SurveyId");

            migrationBuilder.RenameIndex(
                name: "IX_Shortcode_GroupCodeId",
                table: "Shortcodes",
                newName: "IX_Shortcodes_GroupCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupCode_SurveyId",
                table: "GroupCodes",
                newName: "IX_GroupCodes_SurveyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shortcodes",
                table: "Shortcodes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupCodes",
                table: "GroupCodes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupCodes_Surveys_SurveyId",
                table: "GroupCodes",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcodes_GroupCodes_GroupCodeId",
                table: "Shortcodes",
                column: "GroupCodeId",
                principalTable: "GroupCodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcodes_Surveys_SurveyId",
                table: "Shortcodes",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupCodes_Surveys_SurveyId",
                table: "GroupCodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Shortcodes_GroupCodes_GroupCodeId",
                table: "Shortcodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Shortcodes_Surveys_SurveyId",
                table: "Shortcodes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shortcodes",
                table: "Shortcodes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupCodes",
                table: "GroupCodes");

            migrationBuilder.RenameTable(
                name: "Shortcodes",
                newName: "Shortcode");

            migrationBuilder.RenameTable(
                name: "GroupCodes",
                newName: "GroupCode");

            migrationBuilder.RenameIndex(
                name: "IX_Shortcodes_SurveyId",
                table: "Shortcode",
                newName: "IX_Shortcode_SurveyId");

            migrationBuilder.RenameIndex(
                name: "IX_Shortcodes_GroupCodeId",
                table: "Shortcode",
                newName: "IX_Shortcode_GroupCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupCodes_SurveyId",
                table: "GroupCode",
                newName: "IX_GroupCode_SurveyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shortcode",
                table: "Shortcode",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupCode",
                table: "GroupCode",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupCode_Surveys_SurveyId",
                table: "GroupCode",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcode_GroupCode_GroupCodeId",
                table: "Shortcode",
                column: "GroupCodeId",
                principalTable: "GroupCode",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcode_Surveys_SurveyId",
                table: "Shortcode",
                column: "SurveyId",
                principalTable: "Surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
