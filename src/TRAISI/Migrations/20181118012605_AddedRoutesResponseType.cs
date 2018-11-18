using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

namespace TRAISI.Migrations
{
    public partial class AddedRoutesResponseType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<NpgsqlPath>(
                name: "Path",
                table: "ResponseValues",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Path",
                table: "ResponseValues");
        }
    }
}
