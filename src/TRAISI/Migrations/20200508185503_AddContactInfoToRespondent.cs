using Microsoft.EntityFrameworkCore.Migrations;

namespace Traisi.Migrations
{
    public partial class AddContactInfoToRespondent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "SurveyRespondents",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasConsent",
                table: "SurveyRespondents",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "SurveyRespondents",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "SurveyRespondents");

            migrationBuilder.DropColumn(
                name: "HasConsent",
                table: "SurveyRespondents");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "SurveyRespondents");
        }
    }
}
