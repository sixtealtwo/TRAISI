using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using OfficeOpenXml;
using TRAISI.Helpers;
using TRAISI.SDK.Enums;
using System.Text.Json;
using System.Threading.Tasks;
using System.Data;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data;
using TRAISI.Data.Models.ResponseTypes;
using TRAISI.Data.Models.Questions;

namespace TRAISI.Export
{
    public class ResponseTableExporter
    {
        private readonly ApplicationDbContext _context;
        private readonly QuestionTypeManager _questionTypeManager;

        /// <summary>
        /// Initializer for helper object
        /// </summary>
        /// <param name="context"></param>
        /// <param name="questionTypeManager"></param>
        public ResponseTableExporter(ApplicationDbContext context, QuestionTypeManager questionTypeManager)
        {
            _context = context;
            if (questionTypeManager != null)
            {
                _questionTypeManager = questionTypeManager;
            }
            else
            {
                _questionTypeManager = new QuestionTypeManager(null, new NullLoggerFactory());
                _questionTypeManager.LoadQuestionExtensions("../TRAISI/extensions");
            }
        }

        public List<SurveyResponse> ResponseList(List<QuestionPartView> questionPartViews)
        {
            return _context.SurveyResponses.AsQueryable()
                .Where(r => questionPartViews.Select(v => v.QuestionPart).Contains(r.QuestionPart))
                .Include(r => r.ResponseValues)
                .Include(r => r.Respondent)
                .OrderBy(r => r.UpdatedDate)
                .ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyResponse"></param>
        /// <returns></returns>
        public object ReadSingleResponse(SurveyResponse surveyResponse)
        {
            var questionTypeDefinition =
                _questionTypeManager.QuestionTypeDefinitions[surveyResponse.QuestionPart.QuestionType];

            switch (questionTypeDefinition.ResponseType)
            {
                case QuestionResponseType.String:
                    return ((StringResponse)surveyResponse.ResponseValues.First()).Value;
                case QuestionResponseType.Decimal:
                    return ((DecimalResponse)surveyResponse.ResponseValues.First()).Value;
                case QuestionResponseType.Integer:
                    return ((IntegerResponse)surveyResponse.ResponseValues.First()).Value;
                case QuestionResponseType.DateTime:
                    return ((DateTimeResponse)surveyResponse.ResponseValues.First()).Value;
                case QuestionResponseType.Path:
                    return ReadPathResponse(surveyResponse);
                case QuestionResponseType.Json:
                    return ReadJsonResponse(surveyResponse);
                case QuestionResponseType.Location:
                    return ((LocationResponse)surveyResponse.ResponseValues.First()).Address;
                case QuestionResponseType.Timeline:
                    return ReadTimelineResponse(surveyResponse);
                case QuestionResponseType.OptionSelect:
                    return ((OptionSelectResponse)surveyResponse.ResponseValues.First()).Value;
                case QuestionResponseType.Boolean:
                    // this type is currently not implemented in in ResponseTypes
                    throw new NotImplementedException("Tried to export boolean type");
                case QuestionResponseType.Time:
                    // this type is currently not implemented in in ResponseTypes
                    throw new NotImplementedException("Tried to export time type");
                case QuestionResponseType.None:
                    return "";
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private string ReadJsonResponse(SurveyResponse response)
        {
            var responseValues = response.ResponseValues.Cast<JsonResponse>().Select(
                t => new
                {
                    t.Value
                });
            return JsonSerializer.Serialize(responseValues);
            
        }

        private string ReadPathResponse(SurveyResponse surveyResponse) => throw new NotImplementedException();//return null;

        private string ReadTimelineResponse(ISurveyResponse surveyResponse)
        {
            var locations = surveyResponse.ResponseValues.Cast<TimelineResponse>().OrderBy(t => t.Order)
                .Select(t => new
                {
                    t.Name,
                    t.Purpose,
                    t.TimeA,
                    t.TimeB,
                    Location = new { t.Address, t.Location.X, t.Location.Y }
                });
            var locationJson = JsonSerializer.Serialize(locations);
            return locationJson;
        }

        private void PathResponseTable(SurveyResponse surveyResponse, ExcelWorksheet worksheet)
        {
            throw new NotImplementedException();
        }

        private void TimelineResponseTable(SurveyResponse surveyResponse, ExcelWorksheet worksheet)
        {
        }

        public void ResponseListToWorksheet(List<SurveyResponse> surveyResponses, ExcelWorksheet worksheet)
        {
            var responseValuesTask = Task.Run(() =>
                surveyResponses
                    .AsParallel()
                    .WithExecutionMode(ParallelExecutionMode.ForceParallelism)
                    .Select(ReadSingleResponse)
                    .ToList()
                );
            // Place headers
            // inject header
            worksheet.Cells[Row: 1, Col: 1].Value = "Respondent ID";
            worksheet.Cells[Row: 1, Col: 2].Value = "Question Name";
            worksheet.Cells[Row: 1, Col: 3].Value = "Response Type";
            worksheet.Cells[Row: 1, Col: 4].Value = "Response Value";
            worksheet.Cells[Row: 1, Col: 5].Value = "Response Time";
            worksheet.Cells[FromRow: 1, FromCol: 1, ToRow: 1, ToCol: 5].Style.Font.Bold = true;

            var numberOfResponses = surveyResponses.Count;

            // Respondent ID
            var respondentIDs = surveyResponses.Select(r => new object[] { r.Respondent.Id }).ToList();
            worksheet.Cells[2, 1].LoadFromArrays(respondentIDs);

            // Question Name
            var questionNames = surveyResponses.Select(r => new object[] { r.QuestionPart.Name }).ToList();
            worksheet.Cells[2, 2].LoadFromArrays(questionNames);

            // Response Type
            var responseTypes = surveyResponses.Select(r => new object[]
            {
                _questionTypeManager.QuestionTypeDefinitions[r.QuestionPart.QuestionType].ResponseType
            }).ToList();
            worksheet.Cells[2, 3].LoadFromArrays(responseTypes);

            // Response Time
            var responseTimes = surveyResponses.Select(r => new object[] { r.UpdatedDate }).ToList();
            worksheet.Cells[2, 5].LoadFromArrays(responseTimes);
            //worksheet.Cells[2, 5, 1 + numberOfResponses, 5].Style.Numberformat.Format = "yyyy-mm-dd h:mm";

            // Response Value
            responseValuesTask.Wait();
            var responseValues = responseValuesTask.Result.ToList();
            // filter responses if length is longer than 32767 as excel cell limit
            responseValues = responseValues.AsParallel().Select(r =>
            {
                if (r is string rs)
                {
                    if (rs.Length > 32766) return "Error: Contents too long for Excel.";
                }
                return r;
            }).ToList();
            worksheet.Cells[2, 4].LoadFromArrays(responseValues.Select(r => new object[] { r }).ToList());
        }

        public void ResponsesPivot(
            List<QuestionPart> questionParts,
            List<SurveyResponse> surveyResponses,
            List<SurveyRespondent> surveyRespondents,
            ExcelWorksheet worksheet)
        {
            // process questions
            // build dictionary of questions and column numbers
            var questionColumnDict = new Dictionary<QuestionPart, int>();
            // place questions on headers and add to dictionary
            var columnNum = 2;
            foreach (var questionPart in questionParts)
            {
                questionColumnDict.Add(questionPart, columnNum);
                worksheet.Cells[1, columnNum].Value = questionPart.Name;
                columnNum += 1;
            }

            // assign row number for each respondent
            var respondentRowNum = new Dictionary<SurveyRespondent, int>();
            var rowNum = 2;
            foreach (var respondent in surveyRespondents)
            {
                respondentRowNum.Add(respondent, rowNum);
                rowNum += 1;
            }
            // place response into rows via map

            foreach (var respondent in surveyRespondents)
            {
                var responses = surveyResponses.Where(r => r.Respondent == respondent);
                foreach (var response in responses)
                {
                    worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart]].Value
                        = ReadSingleResponse(response);
                }
            }
        }
    }
}