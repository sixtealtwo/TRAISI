using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using CryptoHelper;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TRAISI.Authorization;
using TRAISI.Helpers;
using TRAISI.SDK.Interfaces;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.ViewModels.SurveyViewer.Enums;
using System.Linq;

namespace TRAISI.Controllers.SurveyViewer {
	[Route("api/[controller]")]
	public class SurveyViewerController : Controller {
		private IUnitOfWork _unitOfWork;

		private ISurveyViewerService _viewService;

		private IAccountManager _accountManager;

		private ISurveyBuilderService _builderService;

		private IQuestionTypeManager _manager;


		/// <summary>
		/// 
		/// </summary>
		/// <param name="viewService"></param>
		/// <param name="accountManager"></param>
		/// <param name="unitOfWork"></param>
		public SurveyViewerController(ISurveyViewerService viewService,
			IAccountManager accountManager,
			IUnitOfWork unitOfWork,
			ISurveyBuilderService builderService,
			IQuestionTypeManager manager
		) {
			this._unitOfWork = unitOfWork;
			this._viewService = viewService;
			this._accountManager = accountManager;
			this._builderService = builderService;
			this._manager = manager;
		}

		/// <summary>
		/// Return all questions for a given survey view.
		/// </summary>
		[HttpGet]
		[Produces(typeof(List<SurveyView>))]
		[Route("views/{surveyId}")]
		public async Task<IActionResult> GetSurveyViews(int surveyId) {
			var surveys = await this._unitOfWork.SurveyViews.GetSurveyViews(surveyId);

			return new ObjectResult(surveys);
		}

		/// <summary>
		/// Return all questions for a given survey view.
		/// </summary>
		[HttpGet]
		[Authorize]
		[SurveyUserAuthorization]
		[Produces(typeof(List<SurveyView>))]
		[Route("questions/{viewId}")]
		public async Task<IActionResult> GetSurveyViewQuestions(int viewId) {
			var surveys = await this._unitOfWork.SurveyViews.GetAsync(viewId);

			return new ObjectResult(surveys);
		}

		/// <summary>
		/// Return all questions for a given survey view.
		/// </summary>
		[HttpGet]
		[Authorize]
		[SurveyUserAuthorization]
		[Produces(typeof(List<QuestionPartViewViewModel>))]
		[Route("surveys/{surveyId}/")]
		public async Task<IActionResult> GetSurveyViewPages(int surveyId,
			[FromQuery] SurveyViewType viewType = SurveyViewType.RespondentView, [FromQuery] string language = "en") {
			List<QuestionPartView> surveys = await this._viewService.GetSurveyViewPages(surveyId, viewType);

			var localizedModel = surveys.ToLocalizedModel<List<SurveyViewPageViewModel>, QuestionPartView>(language);
			return new ObjectResult(localizedModel);
		}

		/// <summary>
		/// Retrieves a question configuration.
		/// </summary>
		/// <param name="questionId"></param>
		/// <returns></returns>
		[HttpGet]
		[Authorize(Policy = Policies.RespondToSurveysPolicy)]
		[Produces(typeof(QuestionConfiguration))]
		[Route("configurations/{questionId}")]
		public async Task<IActionResult> GetSurveyViewQuestionConfiguration(int questionId) {
			var QuestionPart = await this._unitOfWork.QuestionParts.GetAsync(questionId);
			return new ObjectResult(QuestionPart.QuestionOptions);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="questionId"></param>
		/// <returns></returns>
		[HttpGet]
		[Authorize]
		[SurveyUserAuthorization]
		[Produces(typeof(List<QuestionOptionsViewModel>))]
		[Route("surveys/{surveyId}/questions/{questionId}/options/")]
		public async Task<IActionResult> GetQuestionOptions(int surveyId, int questionId, [FromQuery] string query = null,
			[FromQuery] string language = "en") {
			var questionOptions = await this._viewService.GetQuestionOptions(questionId);

			var localizedModel = questionOptions.ToLocalizedModel<List<QuestionOptionViewModel>, QuestionOption>(language);

			return new ObjectResult(localizedModel);
		}


		/// <summary>
		/// Retrives a survey's required information to create the survey viewer
		/// </summary>
		/// <param name="surveyId">The ID of the survey</param>
		/// <param name="viewId">The ID of the view, or 0 for default</param>
		/// <param name="language">The language of the survey, or null for default</param>
		/// <returns>Returns the SurveyViewer View Model</returns>
		[HttpGet]
		[Produces(typeof(SurveyViewerViewModel))]
		[Route("view/{surveyId}/{language?}")]
		public async Task<IActionResult> GetDefaultSurveyView(int surveyId, string language = "en") {
			var view = await this._viewService.GetDefaultSurveyView(surveyId);
			return new ObjectResult(view.ToLocalizedModel<SurveyViewerViewModel>(language));
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		[Produces(typeof(ObjectResult))]
		[HttpPost]
		[Route("start/{surveyId}/{shortcode}")]
		public async Task<IActionResult> StartSurvey(int surveyId, string shortcode) {
			(bool success, ApplicationUser user) = await this._viewService.SurveyLogin(surveyId, shortcode);

			if (!success) {
				return new BadRequestResult();
			}

			return new OkResult();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="name"></param>
		/// <returns></returns>
		[Route("welcome/{name}")]
		[HttpGet]
		[Produces(typeof(ObjectResult))]
		public async Task<IActionResult> GetSurveyWelcomeView(string name) {
			var result = await this._viewService.GetSurveyWelcomeView(name);
			if (result == null) {
				return new NotFoundResult();
			}

			return new ObjectResult(result);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="pageNumber"></param>
		/// <param name="language"></param>
		/// <returns></returns>
		[Route("viewer/{surveyId}/page/{pageNumber}")]
		[HttpGet]
		[Produces(typeof(ObjectResult))]
		public async Task<IActionResult> GetRespondentSurveyViewPageQuestions(int surveyId, int pageNumber,
			string language = "en") {
			var result =
				await this._viewService.GetSurveyViewPageQuestions(surveyId, SurveyViewType.RespondentView, pageNumber);
			if (result == null) {
				return new NotFoundResult();
			}

			//var localized = result.ToLocalizedModel<SurveyViewPageViewModel>(language);
			return new ObjectResult(result);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="pageNumber"></param>
		/// <param name="viewType"></param>
		/// <param name="language"></param>
		/// <returns></returns>
		[Route("{surveyId}/page/{pageNumber}/{viewType}/{language?}")]
		[HttpGet]
		[Authorize]
		[Produces(typeof(ObjectResult))]
		public async Task<IActionResult> GetSurveyViewPageQuestions(int surveyId, int pageNumber,
			SurveyViewType viewType, string language = "en") {
			var result = await this._viewService.GetSurveyViewPageQuestions(surveyId,
				viewType, pageNumber);
			if (result == null) {
				return new NotFoundResult();
			}

			return new ObjectResult(result.ToLocalizedModel<SurveyViewPageViewModel>("en"));
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="name"></param>
		/// <returns></returns>
		[Route("{surveyId:int}/terms/{viewType?}/{language?}")]
		[HttpGet]
		[Authorize(Policy = Policies.RespondToSurveysPolicy)]
		[Produces(typeof(ObjectResult))]
		public async Task<IActionResult> GetSurveyTermsAndConditions(int surveyId,
			SurveyViewType viewType = SurveyViewType.RespondentView, string language = null) {
			var result = await this._viewService.GetSurveyTermsAndConditionsText(surveyId, language, viewType);
			if (result == null) {
				return new NotFoundResult();
			}


			return new ObjectResult(result);
		}


		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <returns></returns>
		[HttpGet]
		public async Task<IActionResult> AddTestQuestion(int surveyId) {
			//this._builderService.AddQuestionPartView()

			var survey = await this._unitOfWork.Surveys.GetSurveyFullAsync(surveyId);

			//pull the radio question definition
			var radioDefinition = this._manager.QuestionTypeDefinitions.FirstOrDefault(q => q.TypeName == "Radio Select");

			//adds a question to the root survey view, returns a question part view
			var qpv = this._builderService.AddQuestion(survey.SurveyViews.FirstOrDefault(), radioDefinition);

			//sets the question label text
			this._builderService.SetQuestionPartViewLabel(qpv, "Title Text", "en");

			//add a question opttion to the passed quetsion part
			//has a hidden value of value1..2..3
			//the visible hidden label is "label text"
			//language is "en"
			this._builderService.AddQuestionOption(qpv.QuestionPart, "Response Options", "value1", "en");
			this._builderService.AddQuestionOption(qpv.QuestionPart, "Response Options", "value2", "en");
			this._builderService.AddQuestionOption(qpv.QuestionPart, "Response Options", "value3", "en");

			//set the config value "true" for the configuration setting named "Allow Multiple Selections"
			this._builderService.SetQuestionConfiguration(qpv.QuestionPart, "Allow Multiple Selections", true);

			await this._unitOfWork.SaveChangesAsync();

			return new OkResult();
		}
	}
}