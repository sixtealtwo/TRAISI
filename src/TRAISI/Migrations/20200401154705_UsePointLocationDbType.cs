using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

namespace TRAISI.Migrations
{
    public partial class UsePointLocationDbType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "ResponseValues");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "ResponseValues");

            migrationBuilder.AddColumn<Point>(
                name: "Location",
                table: "ResponseValues",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "ResponseValues");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "ResponseValues",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "ResponseValues",
                type: "double precision",
                nullable: true);
        }
    }
}
