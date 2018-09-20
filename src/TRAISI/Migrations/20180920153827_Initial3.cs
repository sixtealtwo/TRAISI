using Microsoft.EntityFrameworkCore.Migrations;

namespace TRAISI.Migrations
{
    public partial class Initial3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponse_PrimaryRespondents_PrimaryRespondentId",
                table: "SurveyResponse");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponse_QuestionParts_QuestionPartId",
                table: "SurveyResponse");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponse_AspNetUsers_RespondentId",
                table: "SurveyResponse");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponse_ResponseValues_ResponseValueId",
                table: "SurveyResponse");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyResponse",
                table: "SurveyResponse");

            migrationBuilder.RenameTable(
                name: "SurveyResponse",
                newName: "SurveyResponses");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponse_ResponseValueId",
                table: "SurveyResponses",
                newName: "IX_SurveyResponses_ResponseValueId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponse_RespondentId",
                table: "SurveyResponses",
                newName: "IX_SurveyResponses_RespondentId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponse_QuestionPartId",
                table: "SurveyResponses",
                newName: "IX_SurveyResponses_QuestionPartId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponse_PrimaryRespondentId",
                table: "SurveyResponses",
                newName: "IX_SurveyResponses_PrimaryRespondentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyResponses",
                table: "SurveyResponses",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_PrimaryRespondents_PrimaryRespondentId",
                table: "SurveyResponses",
                column: "PrimaryRespondentId",
                principalTable: "PrimaryRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_QuestionParts_QuestionPartId",
                table: "SurveyResponses",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_AspNetUsers_RespondentId",
                table: "SurveyResponses",
                column: "RespondentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponses_ResponseValues_ResponseValueId",
                table: "SurveyResponses",
                column: "ResponseValueId",
                principalTable: "ResponseValues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_PrimaryRespondents_PrimaryRespondentId",
                table: "SurveyResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_QuestionParts_QuestionPartId",
                table: "SurveyResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_AspNetUsers_RespondentId",
                table: "SurveyResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyResponses_ResponseValues_ResponseValueId",
                table: "SurveyResponses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyResponses",
                table: "SurveyResponses");

            migrationBuilder.RenameTable(
                name: "SurveyResponses",
                newName: "SurveyResponse");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponses_ResponseValueId",
                table: "SurveyResponse",
                newName: "IX_SurveyResponse_ResponseValueId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponses_RespondentId",
                table: "SurveyResponse",
                newName: "IX_SurveyResponse_RespondentId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponses_QuestionPartId",
                table: "SurveyResponse",
                newName: "IX_SurveyResponse_QuestionPartId");

            migrationBuilder.RenameIndex(
                name: "IX_SurveyResponses_PrimaryRespondentId",
                table: "SurveyResponse",
                newName: "IX_SurveyResponse_PrimaryRespondentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyResponse",
                table: "SurveyResponse",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponse_PrimaryRespondents_PrimaryRespondentId",
                table: "SurveyResponse",
                column: "PrimaryRespondentId",
                principalTable: "PrimaryRespondents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponse_QuestionParts_QuestionPartId",
                table: "SurveyResponse",
                column: "QuestionPartId",
                principalTable: "QuestionParts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponse_AspNetUsers_RespondentId",
                table: "SurveyResponse",
                column: "RespondentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyResponse_ResponseValues_ResponseValueId",
                table: "SurveyResponse",
                column: "ResponseValueId",
                principalTable: "ResponseValues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
