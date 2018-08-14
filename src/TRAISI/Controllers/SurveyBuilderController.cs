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
using TRAISI.ViewModels.Questions;
using TRAISI.Services.Interfaces;
using DAL.Models.Extensions;

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
        [Produces(typeof(List<SBQuestionTypeDefinitionViewModel>))]
        public IActionResult QuestionTypes()
        {
            var questionTypes = Mapper.Map<List<SBQuestionTypeDefinitionViewModel>>(this._questionTypeManager.QuestionTypeDefinitions);
            return Ok(questionTypes);
        }

        [HttpGet("{surveyId}/PageStructure/{surveyViewName}/{language}")]
        [Produces(typeof(SBSurveyViewViewModel))]
        public async Task<IActionResult> GetSurveyViewPageStructure(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var surveyPageStructure = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                return Ok(surveyPageStructure.ToLocalizedModel<SBSurveyViewViewModel>(language));
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPost("{surveyId}/PageStructure/{surveyViewName}/UpdateOrder")]
        public async Task<IActionResult> UpdateSurveyViewPageOrder(int surveyId, string surveyViewName, [FromBody] List<SBOrderViewModel> pageOrder)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var surveyPageStructure = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                List<QuestionPartView> newOrder = Mapper.Map<List<QuestionPartView>>(pageOrder);
                this._surveyBuilderService.ReOrderPages(surveyPageStructure, newOrder);
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/Part/{parentQuestionPartViewId}/{initialLanguage}")]
        public async Task<IActionResult> AddQuestionPartView(int surveyId, int parentQuestionPartViewId, string initialLanguage, [FromBody] SBQuestionPartViewViewModel questionInfo)
        {
            if (ModelState.IsValid) {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                    var parentPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(parentQuestionPartViewId);
                    QuestionPartView question;
                    question = await this._unitOfWork.QuestionPartViews.GetAsync(questionInfo.Id);
                    if (question == null) {
                        question = Mapper.Map<QuestionPartView>(questionInfo);
                        question.Labels = new LabelCollection<QuestionPartViewLabel>()
                            {
                                new QuestionPartViewLabel()
                                {
                                  Language = initialLanguage,
                                  Value = questionInfo.Label.Value
                                }
                            };
                    }
                    else {
                        //remove question from prior parent and fix order elements
                        var pastParentPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(questionInfo.ParentViewId);
                        this._surveyBuilderService.RemoveQuestionPartView(pastParentPartView, question.Id);
                        question.Order = questionInfo.Order;
                    }
                    this._surveyBuilderService.AddQuestionPartView(parentPartView, question);
                    await this._unitOfWork.SaveChangesAsync();
                    return Ok(question.ToLocalizedModel<SBQuestionPartViewViewModel>(initialLanguage));
                }
                else {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{surveyId}/Part/{parentQuestionPartViewId}/{childQuestionPartViewId}")]
        public async Task<IActionResult> DeleteQuestionPartView(int surveyId, int parentQuestionPartViewId, int childQuestionPartViewId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var parentQuestionPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(parentQuestionPartViewId);
                this._surveyBuilderService.RemoveQuestionPartView(parentQuestionPartView, childQuestionPartViewId);
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else {
                return BadRequest("Insufficient permissions.");
            }

        }

        [HttpGet("{surveyId}/PartStructure/{questionPartViewId}/{language}")]
        [Produces(typeof(SBQuestionPartViewViewModel))]
        public async Task<IActionResult> GetQuestionPartViewPageStructure(int surveyId, int questionPartViewId, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var questionPartViewStructure = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(questionPartViewId);
                return Ok(questionPartViewStructure.ToLocalizedModel<SBQuestionPartViewViewModel>(language));
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPost("{surveyId}/PartStructure/{questionPartViewId}/UpdateOrder")]
        public async Task<IActionResult> UpdateQuestionPartViewOrder(int surveyId, int questionPartViewId, [FromBody] List<SBOrderViewModel> questionOrder)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var questionPartViewStructure = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(questionPartViewId);
                List<QuestionPartView> newOrder = Mapper.Map<List<QuestionPartView>>(questionOrder);
                this._surveyBuilderService.ReOrderQuestions(questionPartViewStructure, newOrder);
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/WelcomePage/{surveyViewName}/{language}")]
        [Produces(typeof(WelcomePageLabelViewModel))]
        public async Task<IActionResult> GetWelcomePageLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var welcomePageLabel = await this._unitOfWork.WelcomePageLabels.GetWelcomePageLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<WelcomePageLabelViewModel>(welcomePageLabel));
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/ThankYouPage/{surveyViewName}/{language}")]
        [Produces(typeof(ThankYouPageLabelViewModel))]
        public async Task<IActionResult> GetThankYouPageLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var thankYouPageLabel = await this._unitOfWork.ThankYouPageLabels.GetThankYouPageLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<ThankYouPageLabelViewModel>(thankYouPageLabel));
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/TermsAndConditionsPage/{surveyViewName}/{language}")]
        [Produces(typeof(TermsAndConditionsPageLabelViewModel))]
        public async Task<IActionResult> GetTermsAndConditionsPageLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var termsAndConditionsPageLabel = await this._unitOfWork.TermsAndConditionsPageLabels.GetTermsAndConditionsPageLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<TermsAndConditionsPageLabelViewModel>(termsAndConditionsPageLabel));
            }
            else {
                return BadRequest("Insufficient privileges.");
            }
        }


        [HttpPut("{surveyId}/WelcomePage")]
        public async Task<IActionResult> UpdateWelcomePageLabel(int surveyId, [FromBody] WelcomePageLabelViewModel welcomePageLabel)
        {
            if (ModelState.IsValid) {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                    WelcomePageLabel welcomePageUpdated = Mapper.Map<WelcomePageLabel>(welcomePageLabel);
                    welcomePageUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(welcomePageUpdated.SurveyViewId);
                    this._unitOfWork.WelcomePageLabels.Update(welcomePageUpdated);
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{surveyId}/ThankYouPage")]
        public async Task<IActionResult> UpdateThankYouPageLabel(int surveyId, [FromBody] ThankYouPageLabelViewModel thankYouPageLabel)
        {
            if (ModelState.IsValid) {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                    ThankYouPageLabel thankYouPageUpdated = Mapper.Map<ThankYouPageLabel>(thankYouPageLabel);
                    thankYouPageUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(thankYouPageUpdated.SurveyViewId);
                    this._unitOfWork.ThankYouPageLabels.Update(thankYouPageUpdated);
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{surveyId}/TermsAndConditionsPage")]
        public async Task<IActionResult> UpdateTermsAndConditionsPageLabel(int surveyId, [FromBody] TermsAndConditionsPageLabelViewModel termsAndConditionsPageLabel)
        {
            if (ModelState.IsValid) {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                    TermsAndConditionsPageLabel termsAndConditionsPageUpdated = Mapper.Map<TermsAndConditionsPageLabel>(termsAndConditionsPageLabel);
                    termsAndConditionsPageUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(termsAndConditionsPageUpdated.SurveyViewId);
                    this._unitOfWork.TermsAndConditionsPageLabels.Update(termsAndConditionsPageUpdated);
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost("{surveyId}/Page/{surveyViewName}/{initialLanguage}")]
        public async Task<IActionResult> AddPage(int surveyId, string surveyViewName, string initialLanguage, [FromBody] SBQuestionPartViewViewModel pageInfo)
        {
            //test
            if (ModelState.IsValid) {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                    var surveyView = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                    QuestionPartView newPage = Mapper.Map<QuestionPartView>(pageInfo);
                    newPage.Labels = new LabelCollection<QuestionPartViewLabel>()
                    {
                        new QuestionPartViewLabel()
                        {
                                                    Language = initialLanguage,
                                                    Value = pageInfo.Label.Value
                        }
                    };
                    this._surveyBuilderService.AddSurveyPage(surveyView, newPage);
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{surveyId}/Page/{surveyViewName}/{pageId}")]
        public async Task<IActionResult> DeletePage(int surveyId, string surveyViewName, int pageId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId)) {
                var surveyView = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                this._surveyBuilderService.RemoveSurveyPage(surveyView, pageId);
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else {
                return BadRequest("Insufficient permissions.");
            }

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