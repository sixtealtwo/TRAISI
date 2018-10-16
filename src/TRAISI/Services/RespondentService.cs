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
using TRAISI.Services.Interfaces;

namespace TRAISI.Services
{
    /// <summary>
    /// Service for handling business logic related to respondents and the updating and querying
    /// of survey responses.
    /// </summary>
    public class RespondentService : IRespondentService
    {
        private IUnitOfWork _unitOfWork;
        private IQuestionTypeManager _questionTypeManager;

        private ILoggerFactory _loggerFactory;

        private ILogger<RespondentService> _logger;

        public static readonly string LOCATION_RESPONSE = "location";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_unitOfWork"></param>
        /// <param name="manager"></param>
        /// <param name="loggerFactory"></param>
        public RespondentService(IUnitOfWork _unitOfWork,
        IQuestionTypeManager manager,
        ILoggerFactory loggerFactory)
        {
            this._unitOfWork = _unitOfWork;
            this._questionTypeManager = manager;

            _loggerFactory = loggerFactory;

            _logger = loggerFactory.CreateLogger<RespondentService>();
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
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <param name="questionId"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        public async Task<bool> SaveResponse(int surveyId, int questionId, ApplicationUser user, JObject responseData)
        {


            var question = await this._unitOfWork.QuestionParts.GetAsync(questionId);
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            var type = this._questionTypeManager.QuestionTypeDefinitions[question.QuestionType];

            var respondent = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);

            if (respondent == null) {
                await this._unitOfWork.SurveyRespondents.CreatePrimaryResponentForUserAsnyc(user);
            }


            if (type.ResponseValidator != null) {
                type.ResponseValidator.ValidateResponse(null);
            }

            var surveyResponse = await this._unitOfWork.SurveyResponses.GetMostRecentResponseForQuestionByRespondentAsync(questionId,
                           (SurveyRespondent)respondent);
            bool isUpdate = false;

            if (surveyResponse == null) {
                surveyResponse = new SurveyResponse()
                {
                    QuestionPart = question,
                    Respondent = respondent,
                };
            }
            else {
                isUpdate = true;
            }

            ResponseValue responseValue = null;
            switch (type.ResponseType) {
                case QuestionResponseType.String:
                    SaveStringResponse(survey, question, user, responseData, surveyResponse);
                    break;

                case QuestionResponseType.Location:
                    SaveLocationResponse(survey, question, user, responseData, surveyResponse);
                    break;
                case QuestionResponseType.Timeline:
                    responseValue = SaveTimelineResponse(survey, question, user, responseData);
                    break;
            }

            try {

                if (!isUpdate) {
                    this._unitOfWork.SurveyResponses.Add(surveyResponse);
                }


                await this._unitOfWork.SaveChangesAsync();
            }
            catch (Exception e) {
                this._logger.LogError(e, "Error saving response.");
                return false;
            }

            return true;




        }

        internal void SavePrimaryRespondentName()
        {
            
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        internal void SaveStringResponse(Survey survey, QuestionPart question, ApplicationUser respondent, JObject responseData, SurveyResponse response)
        {
            if (response.ResponseValue == null) {
                response.ResponseValue = new StringResponse();
            }
            (response.ResponseValue as StringResponse).Value = responseData.GetValue("value").ToObject<string>();

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        internal ResponseValue SaveTimelineResponse(Survey survey, QuestionPart question, ApplicationUser respondent, JObject response)
        {
            LocationResponse val = response.ToObject<TimelineResponse>();

            return val;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        internal void SaveLocationResponse(Survey survey, QuestionPart question, ApplicationUser respondent, JObject responseData, SurveyResponse response)
        {
            if (response.ResponseValue == null) {
                response.ResponseValue = new LocationResponse();
            }
            var value = responseData.ToObject<LocationResponse>();
            (response.ResponseValue as LocationResponse).Latitude = value.Latitude;
            (response.ResponseValue as LocationResponse).Longitude = value.Longitude;
            (response.ResponseValue as LocationResponse).Address = value.Address;

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
            if(type == LOCATION_RESPONSE)
            {
                var result =  await this._unitOfWork.SurveyResponses.ListSurveyResponsesForRespondentByTypeAsync(surveyId, respondent,
                 ResponseTypes.LocationResponse);
                return result;
            }

            return new List<SurveyResponse>();
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="List"></typeparam>
        /// <returns></returns>
        public async Task<SurveyResponse> GetRespondentMostRecentResponseForQuestion(int surveyId, int questionId,
            ApplicationUser user)
        {
            
            var respondent = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForUserAsync(user);

            var response =
                await this._unitOfWork.SurveyResponses.GetMostRecentResponseForQuestionByRespondentAsync(questionId,
                    respondent);

            return response;
        }
    }
}