using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Core.Interfaces;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using TRAISI.Services.Interfaces;
using System.Collections;

namespace TRAISI.Services
{
    public class SurveyViewerService : ISurveyViewerService
    {
        private IUnitOfWork _unitOfWork;

        private IAuthorizationService _authorizationService;
        private IAccountManager _accountManager;

        public QuestionPartView GetQuestion(SurveyView view, int number)
        {
            throw new System.NotImplementedException();
        }

        public bool SurveyLogin(Survey survey, string shortcode)
        {
            throw new System.NotImplementedException();
        }

        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <returns></returns>
        public async Task<SurveyView> GetDefaultSurveyView(int surveyId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            
            return (survey.SurveyViews as List<SurveyView>)[0];
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <returns></returns>
        public SurveyView GetDefaultSurveyView(Survey survey)
        {
            return survey.SurveyViews.GetEnumerator().Current;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="survey"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        public bool AuthorizeSurveyUser(Survey survey, string shortcode)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="unitOfWork"></param>
        public SurveyViewerService(IUnitOfWork unitOfWork,
        IAuthorizationService authorizationService,
        IAccountManager accountManager)
        {
            this._unitOfWork = unitOfWork;
            this._accountManager = accountManager;
            this._authorizationService = authorizationService;
        }
    }
}