using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Text.Json;
using System.Threading.Tasks;
using System.Data;
using System.Runtime;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;
using Traisi.Data.Models.Surveys;
using Traisi.Helpers;
using Traisi.Data;
using Traisi.Sdk.Enums;
using Traisi.Data.Models.ResponseTypes;
using Traisi.Data.Models.Questions;
using Traisi.Sdk.Services;

namespace TRAISI.Export
{
    public class ResponseTableExporter
    {
        private readonly ApplicationDbContext _context;
        private readonly QuestionTypeManager _questionTypeManager;
        String locationPart = "";

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
                .Include(r => r.QuestionPart)
                .Include(r => r.Respondent)
                .ThenInclude(r => r.SurveyRespondentGroup)
                .ThenInclude(r => r.GroupMembers)
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
                    {
                        String retValue = "";
                        if (locationPart == "")
                            retValue = ReadLocationResponse(surveyResponse);
                        else
                            retValue = ReadSplitLocation(surveyResponse, locationPart);

                        locationPart = "";
                        return retValue;
                    }
                //return ((LocationResponse)surveyResponse.ResponseValues.First()).Address;
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

        private List<Tuple<string, string>> ReadJsonResponse_Mode(SurveyResponse response)
        {
            List<Tuple<string, string>> modeDetails = new List<Tuple<string, string>>();
            var responseValues = response.ResponseValues.Cast<JsonResponse>().Select(
                t => new
                {
                    t.Value
                });
            foreach (var modeData in responseValues)
            {
                JObject responseJson = JObject.Parse(modeData.Value);
                string modeName = (string)responseJson.SelectToken("_tripLegs[0]._mode.modeName");
                string modeCat = (string)responseJson.SelectToken("_tripLegs[0]._mode.modeCategory");
                modeDetails.Add(new Tuple<string, string>(modeName, modeCat));
            }
            return modeDetails;
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

        private dynamic ReadTimelineResponseList(ISurveyResponse surveyResponse)
        {
            var locations = surveyResponse.ResponseValues.Cast<TimelineResponse>().OrderBy(t => t.Order)
                .Select(t => new
                {
                    t.Name,
                    t.Purpose,
                    t.TimeA,
                    t.TimeB,
                    t.Address,
                    t.Location.X,
                    t.Location.Y
                });
            return locations;
        }

        private string ReadLocationResponse(ISurveyResponse surveyResponse)
        {
            var locations = surveyResponse.ResponseValues.Cast<LocationResponse>()
                .Select(t => new
                {
                    Location = new { t.Address, t.Location.X, t.Location.Y }
                });
            var locationJson = JsonSerializer.Serialize(locations);
            return locationJson;
        }

        private string ReadSplitLocation(ISurveyResponse surveyResponse, String locationPart)
        {
            string value = string.Empty;
            switch (locationPart)
            {
                case "_address":
                    string addressWithPostalCode = (((LocationResponse)surveyResponse.ResponseValues.First()).Address).ToString();
                    value = addressWithPostalCode.Substring(0, addressWithPostalCode.Length - 6);
                    value = value.TrimEnd(new char[] { ',', ' ' });
                    return value;

                case "_postalCode":
                    string addressWithPostalCode1 = (((LocationResponse)surveyResponse.ResponseValues.First()).Address).ToString();
                    value = addressWithPostalCode1.Substring(addressWithPostalCode1.Length - 6);
                    return value;

                case "_yLatitude":
                    value = (((LocationResponse)surveyResponse.ResponseValues.First()).Location.Y).ToString();
                    return value;

                case "_xLongitude":
                    value = (((LocationResponse)surveyResponse.ResponseValues.First()).Location.X).ToString();
                    return value;
            }
            return value;
        }

        private void PathResponseTable(SurveyResponse surveyResponse, ExcelWorksheet worksheet)
        {
            throw new NotImplementedException();
        }

        private void TimelineResponseTable(SurveyResponse surveyResponse, ExcelWorksheet worksheet)
        {
        }

        public void ResponsesPivot_TravelDiary(
            List<QuestionPart> questionParts,
            List<SurveyResponse> surveyResponses,
            List<SurveyRespondent> surveyRespondents,
            ExcelWorksheet worksheet)
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
            var headerRow = new List<string[]>()
            {
                new string[] { "Respondent ID", "Household ID", "Person ID", "Location Number", "Location Identifier", "Name", "Purpose", "Dep Date", "Dep Day", "Dep Time", "Arr Date", "Arr Day", "Arr Time", "Address", "Postal Code", "Y-Latitude", "X-Longitude", "Mode Category", "Mode Name" }
            };
            worksheet.Cells["A1:S1"].LoadFromArrays(headerRow);
            worksheet.Cells["A1:S1"].Style.Font.Bold = true;

            // Collecting all relevant respondents
            var Respondents_valid = surveyRespondents.Where(x => surveyResponses.Any(y => y.Respondent == x)).ToList();
            var subRespondents = Respondents_valid.SelectMany(pr => pr.SurveyRespondentGroup.GroupMembers).ToList();

            int locNumber = 0;
            int rowNumber = 1;

            Dictionary<Tuple<double, double>, int> Location_Identification = new Dictionary<Tuple<double, double>, int>();

            foreach (var respondent in subRespondents)
            {
                var responses = surveyResponses.Where(r => r.Respondent.SurveyRespondentGroup.GroupMembers.Any(y => y == respondent)).ToList();
                locNumber = 0;

                if (responses.Count() == 0)
                {
                    continue;
                }

                //Timeline
                var response_timeline = surveyResponses.Where(r => r.Respondent.SurveyRespondentGroup.GroupMembers.Any(y => y == respondent))
                                              .Where(r => r.Respondent == respondent)
                                              .Where(y => y.QuestionPart.Name == "Timeline");
               
                //Travel modes
                var response_Json = surveyResponses.Where(r => r.Respondent.SurveyRespondentGroup.GroupMembers.Any(y => y == respondent))
                .Where(r => r.Respondent == respondent)
                .Where(y => y.QuestionPart.Name == "Travel modes");

                if (response_timeline.Count() == 0)
                    continue;

                //Reading Mode Details 
                List<Tuple<string, string>> modeDetails = ReadJsonResponse_Mode(response_Json.First());

                var responseValues_timeline = ReadTimelineResponseList(response_timeline.First());
                foreach (var response in responseValues_timeline)
                {
                    rowNumber++;
                    locNumber++;

                    if (!Location_Identification.ContainsKey(new Tuple<double, double>(response.X, response.Y)))
                    {
                        Location_Identification.Add(new Tuple<double, double>(response.X, response.Y), Location_Identification.Count() + 1);
                    }

                    // Respondent ID (Unique)                
                    worksheet.Cells[rowNumber, 1].Value = (responses.Where(r => r.Respondent == respondent)
                                                            .Select(r => r.Respondent.Id)).First().ToString();

                    // Household ID          
                    worksheet.Cells[rowNumber, 2].Value = (responses.Where(r => r.Respondent.SurveyRespondentGroup.GroupMembers.Any(y => y == respondent))
                                                            .Select(r => r.Respondent.SurveyRespondentGroup.Id)).First().ToString();

                    //Person ID
                    worksheet.Cells[rowNumber, 3].Value = (responses.Where(r => r.Respondent == respondent)
                                                            .Select(r => r.Respondent.SurveyRespondentGroup.GroupMembers.IndexOf(respondent) + 1)).First().ToString();

                    //Location Number
                    worksheet.Cells[rowNumber, 4].Value = locNumber.ToString();

                    //Location Identifier
                    worksheet.Cells[rowNumber, 5].Value = Convert.ToString(Location_Identification[new Tuple<double, double>(response.X, response.Y)]);

                    //Name
                    worksheet.Cells[rowNumber, 6].Value = response.Name;

                    //Purpose
                    worksheet.Cells[rowNumber, 7].Value = response.Purpose;

                    //Departure columns 
                    string timeA = response.TimeA.ToString();
                    if (Regex.IsMatch(timeA, @"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))", RegexOptions.IgnoreCase))
                    {
                        //Departure Date
                        Match dA = Regex.Match(timeA, @"([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))", RegexOptions.IgnoreCase);
                        Match tA = Regex.Match(timeA, @"(1[0-2]|0?[1-9]):(?:[012345]\d):(?:[012345]\d) ([AaPp][Mm])", RegexOptions.IgnoreCase);
                        worksheet.Cells[rowNumber, 8].Value = Convert.ToString(dA.Value);

                        //Departure Day
                        DateTime dtA = DateTime.Parse(dA.Value);
                        worksheet.Cells[rowNumber, 9].Value = Convert.ToString(dtA.DayOfWeek);

                        //Departure Time
                        worksheet.Cells[rowNumber, 10].Value = Convert.ToString(tA.Value);

                    }

                    //Arrival columns 
                    string timeB = response.TimeB.ToString();
                    if (Regex.IsMatch(timeB, @"((20|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))", RegexOptions.IgnoreCase))
                    {
                        //Arrival Date
                        Match dB = Regex.Match(timeB, @"((20|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))", RegexOptions.IgnoreCase);
                        Match tB = Regex.Match(timeB, @"(1[0-2]|0?[1-9]):(?:[012345]\d):(?:[012345]\d) ([AaPp][Mm])", RegexOptions.IgnoreCase);
                        worksheet.Cells[rowNumber, 11].Value = Convert.ToString(dB.Value);

                        //Arrival Day
                        DateTime dtB = DateTime.Parse(dB.Value);
                        worksheet.Cells[rowNumber, 12].Value = Convert.ToString(dtB.DayOfWeek);

                        //Arrival Time
                        worksheet.Cells[rowNumber, 13].Value = Convert.ToString(tB.Value);
                    }

                    //Address
                    string value = string.Empty;
                    string addressWithPostalCode = response.Address.ToString();
                    value = addressWithPostalCode.Substring(0, addressWithPostalCode.Length - 6);
                    value = value.TrimEnd(new char[] { ',', ' ' });
                    worksheet.Cells[rowNumber, 14].Value = value;

                    //Postalcode
                    value = addressWithPostalCode.Substring(addressWithPostalCode.Length - 6);
                    worksheet.Cells[rowNumber, 15].Value = value;

                    //Y Latitude
                    worksheet.Cells[rowNumber, 16].Value = response.Y.ToString();

                    //X Longitude
                    worksheet.Cells[rowNumber, 17].Value = response.X.ToString();

                    //Mode Details
                    if (modeDetails.Count >= locNumber)
                    {
                        //Mode Category
                        worksheet.Cells[rowNumber, 18].Value = modeDetails[locNumber - 1].Item2;

                        //Mode Name
                        worksheet.Cells[rowNumber, 19].Value = modeDetails[locNumber - 1].Item1;
                    }

                }
            }
        }

        public void ResponseListToWorksheet(List<SurveyResponse> surveyResponses, ExcelWorksheet worksheet, Boolean isHouseHold)
        {
            var responseValuesTask = Task.Run(() =>
                surveyResponses
                    .AsParallel()
                    .WithExecutionMode(ParallelExecutionMode.ForceParallelism)
                    .Select(ReadSingleResponse)
                    .ToList()
                );
            /*  worksheet.Cells[Row: 1, Col: 1].Value = "Respondent ID";
             worksheet.Cells[Row: 1, Col: 2].Value = "Question Name";
             worksheet.Cells[Row: 1, Col: 3].Value = "Response Type";
             worksheet.Cells[Row: 1, Col: 4].Value = "Response Value";
             worksheet.Cells[Row: 1, Col: 5].Value = "Response Time";
             worksheet.Cells[FromRow: 1, FromCol: 1, ToRow: 1, ToCol: 5].Style.Font.Bold = true; */

            // Place headers
            // inject header
            var headerRow = new List<string[]>()
            {
                new string[] { "Respondent ID","Household ID", "Person ID", "Question Name", "Response Type", "Response Value", "Response Time" }
            };
            worksheet.Cells["A1:G1"].LoadFromArrays(headerRow);
            worksheet.Cells["A1:G1"].Style.Font.Bold = true;

            var numberOfResponses = surveyResponses.Count;

            // Respondent ID (Unique)    
            var respondentIDs = surveyResponses.Select(r => new object[] { r.Respondent.Id }).ToList();
            worksheet.Cells[2, 1].LoadFromArrays(respondentIDs);

            // Household ID           
            var householdIds = surveyResponses.Select(r => new object[] { r.Respondent.SurveyRespondentGroup.Id }).ToList();
            worksheet.Cells[2, 2].LoadFromArrays(householdIds);

            //In House Person ID for only Personal Questions and Empty for Household Questions.
            if (!isHouseHold)
            {
                var personIds = surveyResponses.Select(r => new object[] { r.Respondent.SurveyRespondentGroup.GroupMembers.IndexOf(r.Respondent) + 1 }).ToList();
                worksheet.Cells[2, 3].LoadFromArrays(personIds);
            }

            // Question Name
            var questionNames = surveyResponses.Select(r => new object[] { r.QuestionPart.Name }).ToList();
            worksheet.Cells[2, 4].LoadFromArrays(questionNames);

            // Response Type
            var responseTypes = surveyResponses.Select(r => new object[]
            {
                _questionTypeManager.QuestionTypeDefinitions[r.QuestionPart.QuestionType].ResponseType
            }).ToList();
            worksheet.Cells[2, 5].LoadFromArrays(responseTypes);

            // Response Time
            var responseTimes = surveyResponses.Select(r => new object[] { r.UpdatedDate.ToString("g") }).ToList();
            worksheet.Cells[2, 7].LoadFromArrays(responseTimes);
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
            worksheet.Cells[2, 6].LoadFromArrays(responseValues.Select(r => new object[] { r }).ToList());
        }

        public void ResponsesPivot_Personal(
            List<QuestionPart> questionParts,
            List<SurveyResponse> surveyResponses,
            List<SurveyRespondent> surveyRespondents,
            ExcelWorksheet worksheet)
        {
            // process questions
            // build dictionary of questions and column numbers
            var questionColumnDict = new Dictionary<QuestionPart, int>();
            // place questions on headers and add to dictionary
            var columnNum = 4;

            // Adding Respondent ID, Household ID and Person ID column name
            worksheet.Cells[1, 1].Value = "Respondent ID";
            worksheet.Cells[1, 2].Value = "Household ID";
            worksheet.Cells[1, 3].Value = "Person ID";

            foreach (var questionPart in questionParts)
            {
                //Removed columns for Travel modes and Timeline.
                if(questionPart.Name == "Travel modes" || questionPart.Name == "Timeline")
                continue;

                questionColumnDict.Add(questionPart, columnNum);

                if (!questionPart.Name.Contains("location"))
                {
                    worksheet.Cells[1, columnNum].Value = questionPart.Name;
                }
                else
                {
                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Address";
                    columnNum += 1;

                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Postal Code";
                    columnNum += 1;

                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Latitude";
                    columnNum += 1;

                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Longitude";
                }
                columnNum += 1;
            }

            // Collecting all relevant respondents
            var Respondents_valid = surveyRespondents.Where(x => surveyResponses.Any(y => y.Respondent == x)).ToList();
            var subRespondents = Respondents_valid.SelectMany(pr => pr.SurveyRespondentGroup.GroupMembers).ToList();

            // Assign row number for each respondent
            var respondentRowNum = new Dictionary<SurveyRespondent, int>();
            var rowNum = 2;

            foreach (var respondent in subRespondents)
            {
                respondentRowNum.Add(respondent, rowNum);
                rowNum += 1;
            }

            // Place response into rows via map  
            foreach (var respondent in subRespondents)
            {
                var responses = surveyResponses.Where(r => r.Respondent.SurveyRespondentGroup.GroupMembers.Any(y => y == respondent)).ToList();

                if (responses.Count() > 0)
                {
                    // Respondent ID (Unique)                
                    worksheet.Cells[respondentRowNum[respondent], 1].Value = (responses.Where(r => r.Respondent == respondent)
                                                                                    .Select(r => r.Respondent.Id)).First().ToString();
                    // Household ID          
                    worksheet.Cells[respondentRowNum[respondent], 2].Value = (responses.Where(r => r.Respondent.SurveyRespondentGroup.GroupMembers.Any(y => y == respondent))
                                                                                    .Select(r => r.Respondent.SurveyRespondentGroup.Id)).First().ToString();
                    //Person ID
                    worksheet.Cells[respondentRowNum[respondent], 3].Value = (responses.Where(r => r.Respondent == respondent)
                                                                                    .Select(r => r.Respondent.SurveyRespondentGroup.GroupMembers.IndexOf(respondent) + 1)).First().ToString();
                }

                foreach (var response in responses)
                {
                    //Removed columns for Travel modes and Timeline
                    if(response.QuestionPart.Name == "Travel modes" || response.QuestionPart.Name == "Timeline")
                    continue;

                    if (!response.QuestionPart.Name.Contains("location"))
                    {
                        worksheet.Cells[respondentRowNum[respondent],
                                        questionColumnDict[response.QuestionPart]].Value
                            = ReadSingleResponse(response);
                    }
                    else
                    {
                        locationPart = "_address";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart]].Value
                        = ReadSingleResponse(response);

                        locationPart = "_postalCode";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart] + 1].Value
                        = ReadSingleResponse(response);

                        locationPart = "_yLatitude";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart] + 2].Value
                        = ReadSingleResponse(response);

                        locationPart = "_xLongitude";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart] + 3].Value
                        = ReadSingleResponse(response);
                    }
                }
            }
        }

        public void ResponsesPivot_HouseHold(
            List<QuestionPart> questionParts,
            List<SurveyResponse> surveyResponses,
            List<SurveyRespondent> surveyRespondents,
            ExcelWorksheet worksheet)
        {
            // process questions
            // build dictionary of questions and column numbers
            var questionColumnDict = new Dictionary<QuestionPart, int>();
            // place questions on headers and add to dictionary
            var columnNum = 3;

            // Adding Respondent ID and Household ID column name
            worksheet.Cells[1, 1].Value = "Respondent ID";
            worksheet.Cells[1, 2].Value = "Household ID";

            foreach (var questionPart in questionParts)
            {
                questionColumnDict.Add(questionPart, columnNum);

                if (!questionPart.Name.Contains("location"))
                {
                    worksheet.Cells[1, columnNum].Value = questionPart.Name;
                }
                else
                {
                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Address";
                    columnNum += 1;

                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Postal Code";
                    columnNum += 1;

                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Latitude";
                    columnNum += 1;

                    worksheet.Cells[1, columnNum].Value = questionPart.Name + ": Longitude";
                }
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
                if (responses.Count() > 0)
                {
                    // Respondent ID (Unique)                
                    worksheet.Cells[respondentRowNum[respondent], 1].Value = (surveyResponses.Where(r => r.Respondent == respondent)
                                                                                    .Select(r => r.Respondent.Id)).First().ToString();
                    // Household ID          
                    worksheet.Cells[respondentRowNum[respondent], 2].Value = (surveyResponses.Where(r => r.Respondent == respondent)
                                                                                    .Select(r => r.Respondent.SurveyRespondentGroup.Id)).First().ToString();
                }

                foreach (var response in responses)
                {
                    if (!response.QuestionPart.Name.Contains("location"))
                    {
                        worksheet.Cells[respondentRowNum[respondent],
                                        questionColumnDict[response.QuestionPart]].Value
                            = ReadSingleResponse(response);
                    }
                    else
                    {
                        locationPart = "_address";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart]].Value
                        = ReadSingleResponse(response);

                        locationPart = "_postalCode";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart] + 1].Value
                        = ReadSingleResponse(response);

                        locationPart = "_yLatitude";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart] + 2].Value
                        = ReadSingleResponse(response);

                        locationPart = "_xLongitude";
                        worksheet.Cells[respondentRowNum[respondent],
                                    questionColumnDict[response.QuestionPart] + 3].Value
                        = ReadSingleResponse(response);
                    }
                }
            }
        }
    }
}