using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;
using System;
using System.Linq;
using AutoMapper;
using DAL.Core.Interfaces;
using DAL.Models.Surveys;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TRAISI.Helpers;
using TRAISI.ViewModels;

namespace TRAISI.Controllers
{
    [Authorize(Authorization.Policies.AccessAdminPolicy)]
    [Route("api/[controller]")]
    public class SurveyBuilderController: Controller
    {
				private readonly IUnitOfWork _unitOfWork;
				private readonly IAuthorizationService _authorizationService;
				private readonly IAccountManager _accountManager;
        private IQuestionTypeManager _questionTypeManager;

        /// <summary>
        /// Constructor the controller.
        /// </summary>
        /// <param name="unitOfWork">Unit of work service.</param>
        /// <param name="questionTypeManager">Question type manager service.</param>
        public SurveyBuilderController(IUnitOfWork unitOfWork, IAuthorizationService authorizationService, IAccountManager accountManager,
										IQuestionTypeManager questionTypeManager)
        {
            this._unitOfWork = unitOfWork;
						this._authorizationService = authorizationService;
						this._accountManager = accountManager;
            this._questionTypeManager = questionTypeManager;
        }

        [HttpGet("question-types")]
        [Produces(typeof(List<QuestionTypeDefinition>))]
        public IEnumerable<QuestionTypeDefinition> QuestionTypes()
        {
            var questionTypes = this._questionTypeManager.QuestionTypeDefinitions;
            return questionTypes;
        }

				[HttpGet("{id}/WelcomePage/{surveyViewId}/{language}")]
				[Produces(typeof(WelcomePageLabelViewModel))]
				public async Task<IActionResult> GetWelcomePageLabel(int id, int surveyViewId, string language)
				{
					var survey = await this._unitOfWork.Surveys.GetAsync(id);
					if(survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
					{
						var welcomePageLabel = await this._unitOfWork.WelcomePageLabels.GetWelcomePageLabelAsync(surveyViewId, language);
						return Ok(Mapper.Map<WelcomePageLabelViewModel>(welcomePageLabel));
					}
					else
					{
						return BadRequest("Insufficient privileges.");
					}		
				}

				[HttpGet("{id}/ThankYouPage/{surveyViewId}/{language}")]
				[Produces(typeof(ThankYouPageLabelViewModel))]
				public async Task<IActionResult> GetThankYouPageLabel(int id, int surveyViewId, string language)
				{
					var survey = await this._unitOfWork.Surveys.GetAsync(id);
					if(survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
					{
						var thankYouPageLabel = await this._unitOfWork.ThankYouPageLabels.GetThankYouPageLabelAsync(surveyViewId, language);
						return Ok(Mapper.Map<ThankYouPageLabelViewModel>(thankYouPageLabel));
					}
					else
					{
						return BadRequest("Insufficient privileges.");
					}		
				}

				[HttpGet("{id}/TermsAndConditionsPage/{surveyViewId}/{language}")]
				[Produces(typeof(TermsAndConditionsPageLabelViewModel))]
				public async Task<IActionResult> GetTermsAndConditionsPageLabel(int id, int surveyViewId, string language)
				{
					var survey = await this._unitOfWork.Surveys.GetAsync(id);
					if(survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
					{
						var termsAndConditionsPageLabel = await this._unitOfWork.TermsAndConditionsPageLabels.GetTermsAndConditionsPageLabelAsync(surveyViewId, language);
						return Ok(Mapper.Map<TermsAndConditionsPageLabelViewModel>(termsAndConditionsPageLabel));
					}
					else
					{
						return BadRequest("Insufficient privileges.");
					}		
				}
				

				[HttpPut("{id}/WelcomePage")]
				public async Task<IActionResult> UpdateWelcomePageLabel(int id, [FromBody] WelcomePageLabelViewModel welcomePageLabel)
				{
					if (ModelState.IsValid)
					{
						var survey = await this._unitOfWork.Surveys.GetAsync(id);
						if(survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
						{
							WelcomePageLabel welcomePageUpdated = Mapper.Map<WelcomePageLabel>(welcomePageLabel);
							welcomePageUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(welcomePageUpdated.SurveyViewId);
							this._unitOfWork.WelcomePageLabels.Update(welcomePageUpdated);
							await this._unitOfWork.SaveChangesAsync();
							return new OkResult();
						}
						else
						{
							return BadRequest("Insufficient permissions.");
						}	
					}
					return BadRequest(ModelState);
				}	

				[HttpPut("{id}/ThankYouPage")]
				public async Task<IActionResult> UpdateThankYouPageLabel(int id, [FromBody] ThankYouPageLabelViewModel thankYouPageLabel)
				{
					if (ModelState.IsValid)
					{
						var survey = await this._unitOfWork.Surveys.GetAsync(id);
						if(survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
						{
							ThankYouPageLabel thankYouPageUpdated = Mapper.Map<ThankYouPageLabel>(thankYouPageLabel);
							thankYouPageUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(thankYouPageUpdated.SurveyViewId);
							this._unitOfWork.ThankYouPageLabels.Update(thankYouPageUpdated);
							await this._unitOfWork.SaveChangesAsync();
							return new OkResult();
						}
						else
						{
							return BadRequest("Insufficient permissions.");
						}	
					}
					return BadRequest(ModelState);
				}	

				[HttpPut("{id}/TermsAndConditions")]
				public async Task<IActionResult> UpdateTermsAndConditionsPageLabel(int id, [FromBody] TermsAndConditionsPageLabelViewModel termsAndConditionsPageLabel)
				{
					if (ModelState.IsValid)
					{
						var survey = await this._unitOfWork.Surveys.GetAsync(id);
						if(survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
						{
							TermsAndConditionsPageLabel termsAndConditionsPageUpdated = Mapper.Map<TermsAndConditionsPageLabel>(termsAndConditionsPageLabel);
							termsAndConditionsPageUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(termsAndConditionsPageUpdated.SurveyViewId);
							this._unitOfWork.TermsAndConditionsPageLabels.Update(termsAndConditionsPageUpdated);
							await this._unitOfWork.SaveChangesAsync();
							return new OkResult();
						}
						else
						{
							return BadRequest("Insufficient permissions.");
						}	
					}
					return BadRequest(ModelState);
				}	

				/// <summary>
				/// Check if user has modify survey permissions
				/// </summary>
				/// <param name="surveyId"></param>
				/// <returns></returns>
				private async Task<bool> HasModifySurveyPermissions (int surveyId)
				{
					var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurveyAsync(this.User.Identity.Name, surveyId);
					bool hasModifySurveyPermissions = surveyPermissions.Permissions.Contains("survey.modify");
					return hasModifySurveyPermissions;
				}

				
		}
}