using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;
using TRAISI.Services.Interfaces;
using System.Linq;
namespace TRAISI.Services
{
    /// <summary>
    /// Service for handling business logic related to respondents and the updating and querying
    /// of survey responses.
    /// </summary>
    public class ResponderService : IResponderService
    {
        private IUnitOfWork _unitOfWork;
        private IQuestionTypeManager _questionTypeManager;
        private ILoggerFactory _loggerFactory;
        private ILogger<ResponderService> _logger;
        public static readonly string LOCATION_RESPONSE = "location";
        public static readonly string TIMELINE_RESPONSE = "location";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_unitOfWork"></param>
        /// <param name="manager"></param>
        /// <param name="loggerFactory"></param>
        public ResponderService(IUnitOfWork _unitOfWork,
        IQuestionTypeManager manager,
        ILoggerFactory loggerFactory)
        {
            this._unitOfWork = _unitOfWork;
            this._questionTypeManager = manager;
            _loggerFactory = loggerFactory;
            _logger = loggerFactory.CreateLogger<ResponderService>();

        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionId"></param>
        /// <param name="subRespondentId"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        public async Task<bool> SaveSubResponse(int questionId, int subRespondentId, JObject responseData)
        {
            var respondent = await this._unitOfWork.SurveyRespondents.GetSubRespondentAsync(subRespondentId);
            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <param name="repeat"></param>
        /// <returns></returns>
        public async Task<bool> SaveResponse(Survey survey, QuestionPart question, SurveyRespondent respondent, JObject responseData, int repeat)
        {

            var type = this._questionTypeManager.QuestionTypeDefinitions[question.QuestionType];

            if (type.ResponseValidator != null) {
                var responseDataUnwrapped = this.UnwrapResponseData(type.ResponseType, responseData);
                type.ResponseValidator.ValidateResponse(responseDataUnwrapped, question.QuestionConfigurations.Cast<IQuestionConfiguration>().ToHashSet());
            }

            var surveyResponse = await this._unitOfWork.SurveyResponses.GetMostRecentResponseForQuestionByRespondentAsync(question.Id,
                           (SurveyRespondent)respondent, repeat);

            if (surveyResponse == null ||
            (
            surveyResponse.SurveyAccessRecord.AccessDateTime < ((PrimaryRespondent)respondent).SurveyAccessRecords.First().AccessDateTime)) {
                surveyResponse = new SurveyResponse()
                {
                    QuestionPart = question,
                    Respondent = respondent,
                    SurveyAccessRecord = ((PrimaryRespondent)respondent).SurveyAccessRecords.First(),
                    Repeat = repeat

                };
                this._unitOfWork.SurveyResponses.Add(surveyResponse);
            }

            // surveyResponse.Repeat = repeat;

            switch (type.ResponseType) {
                case QuestionResponseType.String:
                    SaveStringResponse(survey, question, responseData, surveyResponse);
                    break;

                case QuestionResponseType.Decimal:
                    SaveDecimalResponse(survey, question, responseData, surveyResponse);
                    break;

                case QuestionResponseType.Integer:
                    SaveIntegerResponse(survey, question, responseData, surveyResponse);
                    break;
                case QuestionResponseType.DateTime:
                    SaveDateTimeResponse(surveyResponse, responseData);
                    break;
                case QuestionResponseType.Path:
                    SavePathResponse(surveyResponse, responseData);
                    break;
                case QuestionResponseType.Json:
                    SaveJsonResponse(surveyResponse, responseData);
                    break;
                case QuestionResponseType.Location:
                    SaveLocationResponse(survey, question, responseData, surveyResponse);
                    break;
                case QuestionResponseType.Timeline:
                    SaveTimelineResponse(surveyResponse, responseData);
                    break;
                case QuestionResponseType.OptionSelect:
                    //
                    SaveOptionSelectResponse(survey, question, responseData, surveyResponse);
                    break;
            }
            try {

                await this._unitOfWork.SaveChangesAsync();
            }
            catch (Exception e) {
                this._logger.LogError(e, "Error saving response.");
                return false;
            }

            return true;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="repeat"></param>
        /// <returns></returns>
        private async Task<SurveyResponse> GenerateSurveyResponse(QuestionPart question, SurveyRespondent respondent, int repeat)
        {
            return await this._unitOfWork.SurveyResponses.GetMostRecentResponseForQuestionByRespondentAsync(question.Id,
                           (SurveyRespondent)respondent, repeat);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        internal List<IResponseType> UnwrapResponseData(QuestionResponseType responseType, JObject response)
        {

            switch (responseType) {
                case QuestionResponseType.OptionSelect:
                    return response["values"].ToObject<List<IOptionSelectResponse>>().Cast<IResponseType>().ToList();
                case QuestionResponseType.Timeline:
                    return response["values"].ToObject<List<ITimelineResponse>>().Cast<IResponseType>().ToList();
                case QuestionResponseType.DateTime:
                    return new List<IResponseType>() { response.ToObject<DateTimeResponse>() };
                case QuestionResponseType.String:
                    return new List<IResponseType>() { response.ToObject<StringResponse>() };
                case QuestionResponseType.Location:
                    return new List<IResponseType>() { response["value"].ToObject<LocationResponse>() };
                case QuestionResponseType.Integer:
                    return new List<IResponseType>() { response.ToObject<DecimalResponse>() };
                case QuestionResponseType.Decimal:
                    return new List<IResponseType>() { response.ToObject<DecimalResponse>() };
                case QuestionResponseType.Json:
                    return new List<IResponseType>() { response.ToObject<JsonResponse>() };

                default:
                    break;
            }
            return null;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="responseData"></param>
        internal void SavePathResponse(SurveyResponse response, JObject responseData)
        {
            response.ResponseValues.Clear();
            return;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        internal void SaveStringResponse(Survey survey, QuestionPart question, JObject responseData, SurveyResponse response)
        {
            if (response.ResponseValues.Count == 0) {
                //response.ResponseValues = new List<ResponseValue>();
                response.ResponseValues.Add(new StringResponse());
            }
            (response.ResponseValues[0] as StringResponse).Value = responseData.GetValue("value").ToObject<string>();

        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <param name="response"></param>
        internal void SaveIntegerResponse(Survey survey, QuestionPart question, JObject responseData, SurveyResponse response)
        {
            if (response.ResponseValues.Count == 0) {
                response.ResponseValues.Add(new IntegerResponse());
            }

            (response.ResponseValues[0] as IntegerResponse).Value = responseData.GetValue("value").ToObject<int>();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="responseData"></param>        
        internal void SaveJsonResponse(SurveyResponse response, JObject responseData)
        {
            response.ResponseValues.Clear();

            if (responseData.GetValue("values") != null) {
                var values = responseData.GetValue("values").ToObject<JArray>();

                foreach (var rValue in values) {
                    response.ResponseValues.Add(new JsonResponse()
                    {
                        SurveyResponse = response,
                        Value = rValue.ToString()
                    });
                }
            }
            else {
                var value = responseData.GetValue("value").Value<string>();
                response.ResponseValues.Add(new JsonResponse()
                {
                    SurveyResponse = response,
                    Value = value
                });
                return;
            }

            // (response.ResponseValues[0] as JsonResponse).Value = responseData.ToString();
            return;
        }

        internal void SaveDateTimeResponse(SurveyResponse response, JObject responseData)
        {
            if (response.ResponseValues.Count == 0) {
                //response.ResponseValues = new List<ResponseValue>();
                response.ResponseValues.Add(new DateTimeResponse());
            }


            (response.ResponseValues[0] as DateTimeResponse).Value = responseData.GetValue("value").ToObject<DateTime>();

            return;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <param name="response"></param>
        internal void SaveOptionSelectResponse(Survey survey, QuestionPart question, JObject responseData, SurveyResponse response)
        {

            response.ResponseValues.Clear();

            var values = responseData["values"].ToObject<List<OptionSelectResponse>>();

            foreach (var val in values) {
                response.ResponseValues.Add(new OptionSelectResponse()
                {
                    Value = val.Name,
                    Name = val.Name,
                    Code = val.Code
                });
            }

            return;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <param name="response"></param>
        internal void SaveDecimalResponse(Survey survey, QuestionPart question, JObject responseData, SurveyResponse response)
        {
            if (response.ResponseValues.Count == 0) {
                //response.ResponseValues = new List<ResponseValue>();
                response.ResponseValues.Add(new DecimalResponse());
            }


            (response.ResponseValues[0] as DecimalResponse).Value = responseData.GetValue("value").ToObject<double>();

        }

        /// <summary>
        ///  
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="response"></param> 
        /// <returns></returns>
        internal void SaveTimelineResponse(SurveyResponse response, JObject responseData)
        {
            List<TimelineResponse> values = responseData["values"].ToObject<List<TimelineResponse>>();

            response.ResponseValues.Clear();

            response.ResponseValues.AddRange(values);
            return;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        internal void SaveLocationResponse(Survey survey, QuestionPart question, JObject responseData, SurveyResponse response)
        {
            if (response.ResponseValues.Count == 0) {
                //response.ResponseValues = new List<ResponseValue>();
                response.ResponseValues.Add(new LocationResponse());
            }
            var value = responseData.ToObject<LocationResponse>();
            (response.ResponseValues[0] as LocationResponse).Latitude = value.Latitude;
            (response.ResponseValues[0] as LocationResponse).Longitude = value.Longitude;
            (response.ResponseValues[0] as LocationResponse).Address = value.Address;

            //LocationResponse locationResponseValue = responseData.ToObject<LocationResponse>();

            return;


        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <param name="questionId"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListResponses(int surveyId, string questionId)
        {

            var responses = await this._unitOfWork.SurveyResponses.GetAllAsync();

            return new List<SurveyResponse>();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="type"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListResponsesOfType(int surveyId, string type, ApplicationUser user)
        {
            var respondent = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);

            if (respondent == null) {
                await this._unitOfWork.SurveyRespondents.CreatePrimaryResponentForUserAsnyc(user);
            }

            var result = await this._unitOfWork.SurveyResponses.ListSurveyResponsesForRespondentByTypeAsync(surveyId, respondent, type);
            return result;

        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="List"></typeparam>
        /// <returns></returns>
        public async Task<SurveyResponse> GetRespondentMostRecentResponseForQuestion(int surveyId, int questionId, int respondentId, int repeat,
            ApplicationUser user)
        {

            //var respondent = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);
            var respondent = await this._unitOfWork.SurveyRespondents.GetAsync(respondentId);
            var response =
                await this._unitOfWork.SurveyResponses.GetMostRecentResponseForQuestionByRespondentAsync(questionId,
                    respondent, repeat);

            return response;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionIds"></param>
        /// <param name="respondent"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListSurveyResponsesForQuestionsAsync(List<int> questionIds, SurveyRespondent respondent)
        {
            var responses = await this._unitOfWork.SurveyResponses.ListSurveyResponsesForQuestionsAsync(questionIds, respondent);
            return responses;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="questionNames"></param>
        /// <param name="respondent"></param>
        /// <returns></returns>
        public async Task<List<SurveyResponse>> ListSurveyResponsesForQuestionsByNameAsync(List<string> questionNames, SurveyRespondent respondent)
        {
            return await this._unitOfWork.SurveyResponses.ListMostRecentSurveyResponsesForQuestionsByNameAsync(questionNames, respondent);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="respondentId"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> RemoveAllResponses(int surveyId, int respondentId, ApplicationUser user)
        {
            var respondent = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);


            var members = respondent.SurveyRespondentGroup.GroupMembers;

            foreach (var member in members) {
                await this._unitOfWork.SurveyResponses.DeleteAllResponsesForUser(member, surveyId);
            }

            await this._unitOfWork.SurveyResponses.DeleteAllResponsesForUser(respondent, surveyId);

            this._unitOfWork.SurveyRespondents.RemoveRange(members);

            return true;
        }
    }
}