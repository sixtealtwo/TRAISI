using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

namespace TRAISI.Migrations
{
    public partial class ChangeDateTimeAndResponseTypes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "SurveyAccessRecords");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "SurveyAccessRecords");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "SurveyAccessRecords");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "SurveyAccessRecords");

            migrationBuilder.DropColumn(
                name: "DecimalResponse_Value",
                table: "ResponseValues");

            migrationBuilder.DropColumn(
                name: "Path",
                table: "ResponseValues");

            migrationBuilder.RenameColumn(
                name: "IntegerResponse_Value",
                table: "ResponseValues",
                newName: "NumberResponse_Value");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "AccessDateTime",
                table: "SurveyAccessRecords",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "TimeB",
                table: "ResponseValues",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "TimeA",
                table: "ResponseValues",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "Value",
                table: "ResponseValues",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "NumberResponse_Value",
                table: "ResponseValues",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NumberResponse_Value",
                table: "ResponseValues",
                newName: "IntegerResponse_Value");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AccessDateTime",
                table: "SurveyAccessRecords",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTimeOffset));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "SurveyAccessRecords",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "SurveyAccessRecords",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "SurveyAccessRecords",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "SurveyAccessRecords",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<DateTime>(
                name: "TimeB",
                table: "ResponseValues",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "TimeA",
                table: "ResponseValues",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Value",
                table: "ResponseValues",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "IntegerResponse_Value",
                table: "ResponseValues",
                type: "integer",
                nullable: true,
                oldClrType: typeof(double),
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "DecimalResponse_Value",
                table: "ResponseValues",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<NpgsqlPath>(
                name: "Path",
                table: "ResponseValues",
                type: "path",
                nullable: true);
        }
    }
}
