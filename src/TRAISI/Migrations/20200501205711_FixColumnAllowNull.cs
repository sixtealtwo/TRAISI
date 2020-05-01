using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class FixColumnAllowNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "WelcomePageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "WelcomePageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "WelcomePageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "WelcomePageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TitlePageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "TitlePageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TitlePageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "TitlePageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ThankYouPageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "ThankYouPageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ThankYouPageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "ThankYouPageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TermsAndConditionsPageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "TermsAndConditionsPageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TermsAndConditionsPageLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "TermsAndConditionsPageLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ScreeningQuestionsLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "ScreeningQuestionsLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ScreeningQuestionsLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "ScreeningQuestionsLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "QuestionPartViewLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "QuestionPartViewLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "QuestionPartViewLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "QuestionPartViewLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "QuestionOptionLabels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "QuestionOptionLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "QuestionOptionLabels");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "QuestionOptionLabels");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "QuestionConfigurationLabel");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "QuestionConfigurationLabel");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "QuestionConfigurationLabel");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "QuestionConfigurationLabel");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "WelcomePageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "WelcomePageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "WelcomePageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "WelcomePageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "TitlePageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "TitlePageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "TitlePageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "TitlePageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "ThankYouPageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "ThankYouPageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "ThankYouPageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "ThankYouPageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "TermsAndConditionsPageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "TermsAndConditionsPageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "TermsAndConditionsPageLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "TermsAndConditionsPageLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "ScreeningQuestionsLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "ScreeningQuestionsLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "ScreeningQuestionsLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "ScreeningQuestionsLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "QuestionPartViewLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "QuestionPartViewLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "QuestionPartViewLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "QuestionPartViewLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "QuestionOptionLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "QuestionOptionLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "QuestionOptionLabels",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "QuestionOptionLabels",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "QuestionConfigurationLabel",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "QuestionConfigurationLabel",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "QuestionConfigurationLabel",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "QuestionConfigurationLabel",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
