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
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="shortcode"></param>
        /// <returns></returns>
        public async Task<ApplicationUser> SurveyLogin(int surveyId, string shortcode)
        {
            var survey = await this._unitOfWork.Surveys.GetSurveyForShortcode(shortcode);
            if (survey == null)
            {
                return null;
            }
            else if (survey.Id != surveyId)
            {
                return null;
            }
            
            var user = new UserViewModel();
            ApplicationUser appUser = Mapper.Map<ApplicationUser>(user);
            
            var result = await _accountManager.CreateUserAsync(appUser, user.Roles, shortcode);

            return appUser;
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
        public async Task<SurveyWelcomeViewModel> GetSurveyWelcomeView(string name)
        {
            Survey survey = await this._unitOfWork.Surveys.GetSurveyByNameFullAsync(name);
            
            return survey.ToLocalizedModel<SurveyWelcomeViewModel>("en");
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