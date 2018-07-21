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
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models.Surveys;
using DAL.Models.Questions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TRAISI.Helpers;
using TRAISI.ViewModels;
using TRAISI.ViewModels.Extensions;
using TRAISI.ViewModels.SurveyBuilder;
using TRAISI.Services.Interfaces;

namespace TRAISI.Controllers
{
    [Authorize(Authorization.Policies.AccessAdminPolicy)]
    [Route("api/[controller]")]
    public class SurveyBuilderController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAccountManager _accountManager;
        private readonly IQuestionTypeManager _questionTypeManager;
        private readonly ISurveyBuilderService _surveyBuilderService;

        /// <summary>
        /// Constructor the controller.
        /// </summary>
        /// <param name="unitOfWork">Unit of work service.</param>
        /// <param name="questionTypeManager">Question type manager service.</param>
        public SurveyBuilderController(IUnitOfWork unitOfWork, IAuthorizationService authorizationService, IAccountManager accountManager,
                                        IQuestionTypeManager questionTypeManager, ISurveyBuilderService surveyBuilderService)
        {
            this._unitOfWork = unitOfWork;
            this._authorizationService = authorizationService;
            this._accountManager = accountManager;
            this._questionTypeManager = questionTypeManager;
            this._surveyBuilderService = surveyBuilderService;
        }

        [HttpGet("question-types")]
        [Produces(typeof(List<QuestionTypeDefinition>))]
        public IEnumerable<QuestionTypeDefinition> QuestionTypes()
        {
            var questionTypes = this._questionTypeManager.QuestionTypeDefinitions;
            return questionTypes;
        }

        [HttpGet("{id}/PageStructure/{surveyViewName}/{language}")]
        [Produces(typeof(SBSurveyViewViewModel))]
        public async Task<IActionResult> GetSurveyViewPageStructure(int id, string surveyViewName, string language) {
            var survey = await this._unitOfWork.Surveys.GetAsync(id);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
            {
                var surveyPageStructure = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(id, surveyViewName);
                return Ok(surveyPageStructure.ToLocalizedModel<SBSurveyViewViewModel>(language));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{id}/WelcomePage/{surveyViewName}/{language}")]
        [Produces(typeof(WelcomePageLabelViewModel))]
        public async Task<IActionResult> GetWelcomePageLabel(int id, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(id);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
            {
                var welcomePageLabel = await this._unitOfWork.WelcomePageLabels.GetWelcomePageLabelAsync(id, surveyViewName, language);
                return Ok(Mapper.Map<WelcomePageLabelViewModel>(welcomePageLabel));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{id}/ThankYouPage/{surveyViewName}/{language}")]
        [Produces(typeof(ThankYouPageLabelViewModel))]
        public async Task<IActionResult> GetThankYouPageLabel(int id, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(id);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
            {
                var thankYouPageLabel = await this._unitOfWork.ThankYouPageLabels.GetThankYouPageLabelAsync(id, surveyViewName, language);
                return Ok(Mapper.Map<ThankYouPageLabelViewModel>(thankYouPageLabel));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{id}/TermsAndConditionsPage/{surveyViewName}/{language}")]
        [Produces(typeof(TermsAndConditionsPageLabelViewModel))]
        public async Task<IActionResult> GetTermsAndConditionsPageLabel(int id, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(id);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
            {
                var termsAndConditionsPageLabel = await this._unitOfWork.TermsAndConditionsPageLabels.GetTermsAndConditionsPageLabelAsync(id, surveyViewName, language);
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
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
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
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
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

        [HttpPut("{id}/TermsAndConditionsPage")]
        public async Task<IActionResult> UpdateTermsAndConditionsPageLabel(int id, [FromBody] TermsAndConditionsPageLabelViewModel termsAndConditionsPageLabel)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(id);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
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

        [HttpPost("{id}/Page/{surveyViewName}/{language}")]
        public async Task<IActionResult> AddPage(int id, string surveyViewName, string language, [FromBody] SBQuestionPartViewViewModel pageInfo)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(id);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(id))
                {
                    var surveyView = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(id, surveyViewName);
                    QuestionPartView newPage = Mapper.Map<QuestionPartView>(pageInfo);
                    newPage.Labels = new List<QuestionPartViewLabel>()
                    {
                        new QuestionPartViewLabel()
                        {
                            Label = new Label()
                            {
                                Language = language,
                                Value = pageInfo.Label
                            }
                        }
                    };
                    this._surveyBuilderService.AddSurveyPage(surveyView, newPage);
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
        private async Task<bool> HasModifySurveyPermissions(int surveyId)
        {
            var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurveyAsync(this.User.Identity.Name, surveyId);
            bool hasModifySurveyPermissions = surveyPermissions.Permissions.Contains(SurveyPermissions.ModifySurvey.Value);
            return hasModifySurveyPermissions;
        }


    }
}