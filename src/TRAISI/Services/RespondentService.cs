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

            switch (type.ResponseType)
            {
                case QuestionResponseType.String:
                    return await SaveStringResponse(survey, question, user, responseData);

                case QuestionResponseType.Location:
                    return await SaveStringResponse(survey, question, user, responseData);
                default:
                    break;
            }

            return false;


        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        internal async Task<bool> SaveStringResponse(Survey survey, QuestionPart question, ApplicationUser respondent, JObject responseData)
        {
            SurveyResponse response = new SurveyResponse()
            {
                ResponseValue = new StringResponse()
                {
                    Value = "Placeholder"
                },
                QuestionPart = question,
                Respondent = respondent
            };
            try
            {
                await this._unitOfWork.SurveyResponses.AddAsync(response);
				await this._unitOfWork.SaveChangesAsync();
            }
            catch (Exception e)
            {
                this._logger.LogError(e, "Error saving String response type.");
				return false;
            }

            

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="question"></param>
        /// <param name="respondent"></param>
        /// <param name="responseData"></param>
        /// <returns></returns>
        internal async Task<bool> SaveLocationResponse(Survey survey, QuestionPart question, ApplicationUser respondent, JObject responseData)
        {
            SurveyResponse response = new SurveyResponse()
            {
                ResponseValue = new LocationResponse()
                {
                    Address = "Cat",
                    Latitude = 0,
                    Longitude = 0
                },
                QuestionPart = question,
                Respondent = respondent,
            };
            try
            {
                await this._unitOfWork.SurveyResponses.AddAsync(response);
				await this._unitOfWork.SaveChangesAsync();
            }
            catch (Exception e)
            {
                this._logger.LogError(e, "Error saving Location response type.");
				return false;
            }
            
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
        public async Task<List<SurveyResponse>> ListResponses(int surveyId, string questionId)
        {

            var responses = await this._unitOfWork.SurveyResponses.GetAllAsync();

            return new List<SurveyResponse>();

        }
    }
}