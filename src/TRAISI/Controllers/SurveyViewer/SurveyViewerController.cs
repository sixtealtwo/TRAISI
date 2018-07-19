using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels;
using TRAISI.ViewModels.SurveyViewer;
using CryptoHelper;
using TRAISI.ViewModels.Extensions;
using AutoMapper;

namespace TRAISI.Controllers.SurveyViewer
{

    [Authorize]
    [Route("api/[controller]")]
    public class SurveyViewerContoller
    {

        private IUnitOfWork _unitOfWork;

        private ISurveyViewerService _viewService;

        private IAccountManager _accountManager;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="viewService"></param>
        public SurveyViewerContoller(ISurveyViewerService viewService,
        IAccountManager accountManager
        )
        {
            this._unitOfWork = null;
            this._viewService = viewService;
            this._accountManager = accountManager;
   

        }

        /// <summary>
        /// Return all questions for a given survey view.
        /// </summary>
        [HttpGet]
        [Produces(typeof(List<SurveyView>))]
        public async Task<IActionResult> GetSurveyViews(int surveyId)
        {
            var surveys = await this._unitOfWork.SurveyViews.GetSurveyViews(surveyId);

            return new ObjectResult(surveys);
        }

        /// <summary>
        /// Return all questions for a given survey view.
        /// </summary>
        [HttpGet]
        [Produces(typeof(List<SurveyView>))]
        public async Task<IActionResult> GetSurveyViewQuestions(int viewId)
        {
            var surveys = await this._unitOfWork.SurveyViews.GetAsync(viewId);

            return new ObjectResult(surveys);
        }

        /// <summary>
        /// Retrieves a question configuration.
        /// </summary>
        /// <param name="questionId"></param>
        /// <returns></returns>
        [HttpGet]
        [Produces(typeof(QuestionConfiguration))]
        public async Task<IActionResult> GetSurveyViewQuestionConfiguration(int questionId)
        {
            var QuestionPart = await this._unitOfWork.QuestionParts.GetAsync(questionId);
            return new ObjectResult(QuestionPart.QuestionOptions);

        }

        /// <summary>
        /// Retrieves the default survey view
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>

        [HttpGet]
        [Produces(typeof(SurveyViewerViewModel))]
        public SurveyViewerViewModel GetDefaultSurveyView(Survey s)
        {

           return this._viewService.GetDefaultSurveyView(s).ToLocalizedModel<SurveyViewerViewModel>("en");
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        [Produces(typeof(ObjectResult))]
        public async Task<IActionResult> StartSurvey(int surveyId, string shortcode)
        {

            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if(survey == null)
            {
                return new ChallengeResult();
            }

            if (this._viewService.AuthorizeSurveyUser(survey, shortcode))
            {
                return new OkResult();
            }
            else
            {
                return new ChallengeResult();
            }
        }

    }
}