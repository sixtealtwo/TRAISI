using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using TRAISI.Authorization.Enums;
using TRAISI.Helpers;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.SurveyViewer.Enums;
using TRAISI.ViewModels.Users;

namespace TRAISI.Services {
	public class SurveyViewerService : ISurveyViewerService {
		private IUnitOfWork _unitOfWork;

		private IAuthorizationService _authorizationService;
		private IAccountManager _accountManager;

		private ICodeGeneration _codeGeneration;

		private UserManager<TraisiUser> _userManager;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="unitOfWork"></param>
		/// <param name="authorizationService"></param>
		/// <param name="accountManager"></param>
		/// <param name="codeGenerationService"></param>
		/// <param name="userManager"></param>
		public SurveyViewerService (IUnitOfWork unitOfWork,
			IAuthorizationService authorizationService,
			IAccountManager accountManager,
			ICodeGeneration codeGenerationService,
			UserManager<TraisiUser> userManager) {
			this._unitOfWork = unitOfWork;
			this._accountManager = accountManager;
			this._authorizationService = authorizationService;
			this._codeGeneration = codeGenerationService;
			this._userManager = userManager;
		}

		/// <summary>
		/// Returns the Terms and Conditions text for the specified survey id of the chosen language
		/// </summary>
		/// <param name="surveyId"></param>
		/// <returns></returns>
		public async Task<SurveyViewTermsAndConditionsViewModel> GetSurveyTermsAndConditionsText (int surveyId,
			string language = null,
			SurveyViewType viewType = SurveyViewType.RespondentView) {
			Survey survey = await this._unitOfWork.Surveys.GetSurveyFullAsync (surveyId, viewType);

			if (viewType == SurveyViewType.RespondentView && survey.SurveyViews.Count > 0) {
				var s2 = (survey.SurveyViews as List<SurveyView>);
				return (survey.SurveyViews as List<SurveyView>) [0]
					.ToLocalizedModel<SurveyViewTermsAndConditionsViewModel> (language);
			} else {

				return (survey.SurveyViews as List<SurveyView>) [0]
					.ToLocalizedModel<SurveyViewTermsAndConditionsViewModel> (language);

			}
		}

		/// <summary>
		/// Returns ths Thank You text for the specified survey id of the chosen language
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="language"></param>
		/// <param name="viewType"></param>
		/// <returns></returns>
		public async Task<SurveyViewThankYouViewModel> GetSurveyThankYouText (int surveyId, string language = null, SurveyViewType viewType = SurveyViewType.CatiView) {
			string viewName = viewType == SurveyViewType.RespondentView ? "Standard" : "CATI";
			var surveyThankYou = await this._unitOfWork.ThankYouPageLabels.GetThankYouPageLabelAsync (surveyId, viewName, language);
			return Mapper.Map<SurveyViewThankYouViewModel> (surveyThankYou);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="questionId"></param>
		/// <returns></returns>
		public async Task<List<QuestionOption>> GetQuestionOptions (int questionId) {
			var questionOptions = await this._unitOfWork.QuestionOptions.GetQuestionOptionsFullAsync (questionId);
			return (List<QuestionOption>) questionOptions;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		private async Task<SurveyUser> GetSurveyUser (Survey survey, string shortcode) {
			return await this._accountManager.GetSurveyUserByShortcodeAsync (survey, shortcode);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="loginSuccess"></param>
		/// <param name="user"></param>
		/// <returns></returns>
		public async Task < (bool loginSuccess, SurveyUser user) > SurveyGroupcodeLogin (Survey survey,
			string code, ClaimsPrincipal user, string userAgent, JObject queryParams) {
			var groupcode = await this._unitOfWork.GroupCodes.GetGroupcodeForSurvey (survey, code);
			if (groupcode == null) {
				return (false, null);
			}
			var parameters = new CodeGeneration () {
				CodeLength = 10,
					UsePattern = false
			};
			var shortcodeRes = await this._codeGeneration.GenerateShortCode (parameters, survey);
			shortcodeRes.Groupcode = groupcode;
			var createUserRes = await this.CreateSurveyUser (survey, shortcodeRes, user);
			// createUserRes.respondent
			var loginResult = await SurveyLogin (survey, shortcodeRes.Code, user, userAgent, queryParams);
			return loginResult;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="survey"></param>
		/// <param name="shortcode"></param>
		/// <param name="currentUser"></param>
		/// <returns></returns>
		private async Task < (bool, string[], SurveyUser, PrimaryRespondent respondent) >
			CreateSurveyUser (Survey survey, Shortcode shortcode, ClaimsPrincipal currentUser) {

				var user = new UserViewModel { UserName = Guid.NewGuid ().ToString ("D") };
				SurveyUser appUser = Mapper.Map<SurveyUser> (user);
				var result = await _accountManager.CreateSurveyUserAsync (appUser, shortcode, null,
					new (string claimName, string claimValue) [] {
						("SurveyId", survey.Id.ToString ()), ("Shortcode", shortcode.Code)
					});

				result.Item3.Shortcode = shortcode;

				// create the associated primary respondent 
				var respondent = await this._unitOfWork.SurveyRespondents.CreatePrimaryResponentForUserAsnyc (appUser);

				return (result.Item1, result.Item2, appUser, respondent);
			}

		/// <inheritdoc />
		/// <summary>
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		public async Task < (bool loginSuccess, SurveyUser user) > SurveyLogin (Survey survey, string shortcode, ClaimsPrincipal currentUser, string userAgent, JObject queryParams) {

			if (currentUser.Identity.IsAuthenticated) {
				if (currentUser.IsInRole (TraisiRoles.SuperAdministrator)) {

					var user = await _userManager.FindByNameAsync (currentUser.Identity.Name);

					if (user == null) {
						return (false, null);
					}

					var respondent = await _unitOfWork.SurveyRespondents.GetPrimaryRespondentForSurveyAndTraisiUserAsync (user, survey);

					if (respondent == null) {
						respondent = new PrimaryRespondent () {
							User = user,
								Survey = survey,
								SurveyAccessRecords = new List<SurveyAccessRecord> (new SurveyAccessRecord[] {
									new SurveyAccessRecord () {
										AccessDateTime = DateTime.Now,
											UserAgent = userAgent,
											AccessUser = user,
											QueryParams = queryParams.ToString (Newtonsoft.Json.Formatting.None)
									}
								}),
								SurveyRespondentGroup = new SurveyRespondentGroup ()

						};
						_unitOfWork.SurveyRespondents.Add (respondent);

					} else {
						respondent.SurveyAccessRecords.Add (new SurveyAccessRecord () {
							AccessDateTime = DateTime.Now,
								UserAgent = userAgent,
								QueryParams = queryParams.ToString (Newtonsoft.Json.Formatting.None),
								AccessUser = user
						});
					}
					return (true, null);
				}
			}

			//see if a user exists
			var existingUser = await this.GetSurveyUser (survey, shortcode);
			if (existingUser != null) {
				// ((PrimaryRespondent)existingUser.PrimaryRespondent).SurveyAccessRecords.Add(new SurveyAccessRecord());
				existingUser.PrimaryRespondent.SurveyAccessRecords.Add (new SurveyAccessRecord () {
					AccessDateTime = DateTime.Now,
						UserAgent = userAgent,
						AccessUser = existingUser,
						QueryParams = queryParams.ToString (Newtonsoft.Json.Formatting.None)
				});

				await this._unitOfWork.SaveChangesAsync ();
				return (true, existingUser);
			}

			// find the shortcode
			var shortcodeRef = await this._unitOfWork.Shortcodes.GetShortcodeForSurveyAsync (survey, shortcode);

			if (shortcodeRef == null) {
				return (false, null);
			}
			var res = await CreateSurveyUser (survey, shortcodeRef, currentUser);

			res.respondent.SurveyAccessRecords.Add (new SurveyAccessRecord () {
				AccessDateTime = DateTime.Now,
					UserAgent = userAgent,
					AccessUser = res.Item3,
					QueryParams = queryParams.ToString (Newtonsoft.Json.Formatting.None)
			});
			await this._unitOfWork.SaveChangesAsync ();
			return res.Item1 ? (true, res.Item3) : (false, null);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <returns></returns>
		public async Task<SurveyView> GetDefaultSurveyView (int surveyId) {
			var survey = await this._unitOfWork.Surveys.GetSurveyWithLabelsAsync (surveyId, SurveyViewType.RespondentView);

			return (survey.SurveyViews as List<SurveyView>) [0];
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="survey"></param>
		/// <returns></returns>
		public SurveyView GetDefaultSurveyView (Survey survey) {
			return survey.SurveyViews.GetEnumerator ().Current;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="code"></param>
		/// <returns></returns>
		public async Task<Survey> GetSurveyFromCode (string code) {
			return await this._unitOfWork.Surveys.GetSurveyByCodeAsync (code);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="name"></param>
		/// <returns></returns>
		public async Task<SurveyStartViewModel> GetSurveyWelcomeView (string name) {
			Survey survey = await this._unitOfWork.Surveys.GetSurveyByCodeFullAsync (name);

			return survey.ToLocalizedModel<SurveyStartViewModel> ("en");
			//return AutoMapper.Mapper.Map<SurveyWelcomeViewModel>(survey,"en");
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="survey"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		public bool AuthorizeSurveyUser (Survey survey, string shortcode) {
			throw new System.NotImplementedException ();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="viewType"></param>
		/// <param name="pageNumber"></param>
		/// <returns></returns>
		public async Task<QuestionPartView> GetSurveyViewPageQuestions (int surveyId, SurveyViewType viewType,
			int pageNumber) {
			var survey = await this._unitOfWork.Surveys.GetSurveyFullAsync (surveyId, viewType);
			if (survey != null) {
				return ((List<SurveyView>) survey.SurveyViews) [0].QuestionPartViews
					.FirstOrDefault (v => v.Order == pageNumber);
			} else {
				return null;
			}
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// /// <param name="viewType"></param>
		/// <param name="pageNumber"></param>
		/// <returns></returns>
		public async Task<List<QuestionPartView>> GetSurveyViewPages (int surveyId, SurveyViewType viewType) {
			var survey = await this._unitOfWork.Surveys.GetSurveyFullAsync (surveyId, viewType);
			if (survey != null) {
				List<QuestionPartView> pages = survey.SurveyViews[0].QuestionPartViews.OrderBy (p => p.Order).ToList ();
				// order everything
				pages.ForEach (page => {
					page.QuestionPartViewChildren = page.QuestionPartViewChildren.OrderBy (mq => mq.Order).ToList ();
					((List<QuestionPartView>) page.QuestionPartViewChildren).ForEach (child => {
						if (child.QuestionPartViewChildren != null && child.QuestionPartViewChildren.Count > 1) {
							child.QuestionPartViewChildren = child.QuestionPartViewChildren.OrderBy (mq => mq.Order).ToList ();
						}
					});
				});
				return pages;
			} else {
				return null;
			}
		}
	}
}