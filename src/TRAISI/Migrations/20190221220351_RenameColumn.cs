using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class RenameColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shortcodes_Groupcodes_GroupCodeId",
                table: "Shortcodes");

            migrationBuilder.RenameColumn(
                name: "GroupCodeId",
                table: "Shortcodes",
                newName: "GroupcodeId");

            migrationBuilder.RenameIndex(
                name: "IX_Shortcodes_GroupCodeId",
                table: "Shortcodes",
                newName: "IX_Shortcodes_GroupcodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcodes_Groupcodes_GroupcodeId",
                table: "Shortcodes",
                column: "GroupcodeId",
                principalTable: "Groupcodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shortcodes_Groupcodes_GroupcodeId",
                table: "Shortcodes");

            migrationBuilder.RenameColumn(
                name: "GroupcodeId",
                table: "Shortcodes",
                newName: "GroupCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_Shortcodes_GroupcodeId",
                table: "Shortcodes",
                newName: "IX_Shortcodes_GroupCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shortcodes_Groupcodes_GroupCodeId",
                table: "Shortcodes",
                column: "GroupCodeId",
                principalTable: "Groupcodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
