using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TRAISI.Migrations
{
    public partial class ApplicationRoleLevel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "AspNetRoles",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "AspNetRoles");
        }
    }
}
