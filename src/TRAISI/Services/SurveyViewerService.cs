using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Core.Interfaces;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using TRAISI.Services.Interfaces;
using System.Collections;
using AutoMapper;
using DAL.Models;
using TRAISI.ViewModels;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.Users;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.SurveyViewer.Enums;

namespace TRAISI.Services
{
    public class SurveyViewerService : ISurveyViewerService
    {
        private IUnitOfWork _unitOfWork;

        private IAuthorizationService _authorizationService;
        private IAccountManager _accountManager;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="view"></param>
        /// <param name="number"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public QuestionPartView GetQuestion(SurveyView view, int number)
        {
            throw new System.NotImplementedException();
        }

        /// <summary>
        /// Returns the Terms and Conditions text for the specified survey id of the chosen language
        /// </summary>
        /// <param name="surveyId"></param>
        /// <returns></returns>
        public async Task<SurveyViewTermsAndConditionsViewModel> GetSurveyTermsAndConditionsText(int surveyId,
        string language = null,
        SurveyViewType viewType = SurveyViewType.RespondentView)
        {
            Survey survey = await this._unitOfWork.Surveys.GetSurveyFullAsync(surveyId);

            if (viewType == SurveyViewType.RespondentView && survey.SurveyViews.Count > 0) {
                var s2 =  (survey.SurveyViews as List<SurveyView>);
                return (survey.SurveyViews as List<SurveyView>)[0].ToLocalizedModel<SurveyViewTermsAndConditionsViewModel>(language);
            }
            else {
                if (survey.SurveyViews.Count > 1) {
                    return (survey.SurveyViews as List<SurveyView>)[0].ToLocalizedModel<SurveyViewTermsAndConditionsViewModel>(language);
                }
            }

            // no valid view available
            return null;

        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        private async Task<ApplicationUser> GetSurveyUser(int surveyId, string shortcode)
        {
            return await this._accountManager.GetUserByUserNameAsync(surveyId + "_" + shortcode);
        }


        /// <inheritdoc />
        /// <summary>
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        public async Task<(bool loginSuccess, ApplicationUser user)> SurveyLogin(int surveyId, string shortcode)
        {
            var survey = await this._unitOfWork.Surveys.GetSurveyForShortcode(shortcode);
            if (survey == null) {
                return (false, null);
            }

            if (survey.Id != surveyId) {
                return (false, null);
            }

            //see if a user exists
            var existingUser = await this.GetSurveyUser(surveyId, shortcode);

            if (existingUser != null) {
                return (true, existingUser);
            }

            var user = new UserViewModel { UserName = surveyId + "_" + shortcode };

            ApplicationUser appUser = Mapper.Map<ApplicationUser>(user);

            var result = await _accountManager.CreateSurveyUserAsync(appUser, shortcode,
             new (string claimName, string claimValue) []{("SurveyId",surveyId.ToString()),("Shortcode",shortcode)});
            return result.Item1 ? (true, appUser) : (false, null);
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
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<SurveyStartViewModel> GetSurveyWelcomeView(string name)
        {
            Survey survey = await this._unitOfWork.Surveys.GetSurveyByNameFullAsync(name);

            return survey.ToLocalizedModel<SurveyStartViewModel>("en");
            //return AutoMapper.Mapper.Map<SurveyWelcomeViewModel>(survey,"en");
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