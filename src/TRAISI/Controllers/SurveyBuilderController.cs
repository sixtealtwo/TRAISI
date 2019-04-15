using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Builder;
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
using System.IO;
using Newtonsoft.Json;
using FluentValidation.Results;


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
        private readonly IFileDownloader _fileDownloader;
        private readonly IOptions<RequestLocalizationOptions> _localizationOptions;

        /// <summary>
        /// Constructor the controller.
        /// </summary>
        /// <param name="unitOfWork">Unit of work service.</param>
        /// <param name="questionTypeManager">Question type manager service.</param>
        public SurveyBuilderController(IUnitOfWork unitOfWork, IFileDownloader fileDownloaderService, IAuthorizationService authorizationService, IAccountManager accountManager,
                                        IQuestionTypeManager questionTypeManager, ISurveyBuilderService surveyBuilderService, IOptions<RequestLocalizationOptions> localizationOptions)
        {
            this._unitOfWork = unitOfWork;
            this._authorizationService = authorizationService;
            this._accountManager = accountManager;
            this._questionTypeManager = questionTypeManager;
            this._surveyBuilderService = surveyBuilderService;
            this._fileDownloader = fileDownloaderService;
            this._localizationOptions = localizationOptions;
        }

        [HttpGet("question-types")]
        [Produces(typeof(List<SBQuestionTypeDefinitionViewModel>))]
        public IActionResult QuestionTypes()
        {
            var questionTypes = Mapper.Map<List<SBQuestionTypeDefinitionViewModel>>(this._questionTypeManager.QuestionTypeDefinitions.Values);
            return Ok(questionTypes);
        }

        /// <summary>
        /// Generates a CATI view for a given language by replicating the current Standard View
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="language"></param>
        /// <returns>Updated Standard View with Dependent Links</returns>
        [HttpGet("{surveyId}/GenerateCATIView/{language}")]
        [Produces(typeof(SBSurveyViewViewModel))]
        public async Task<IActionResult> GenerateCATIView(int surveyId, string language)
        {
            var supportedLanguages = this._localizationOptions.Value.SupportedCultures.Select(c => c.Name);
            if (supportedLanguages.Contains(language))
            {
                var survey = await this._unitOfWork.Surveys.GetSurveyLabelsAndPartsAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    // get current standard view structure to duplicate
                    SurveyView standardSurveyStructure = survey.SurveyViews.Where(v => v.ViewName == "Standard").SingleOrDefault(); //this._unitOfWork.SurveyViews.GetSurveyViewQuestionStructure(surveyId, "Standard");
                    // add CATI or get existing view
                    SurveyView catiView = this._surveyBuilderService.AddSurveyView(survey, "CATI");
                    // duplicate structure and create labels for language
                    this._surveyBuilderService.DuplicateSurveyViewStructure(standardSurveyStructure, catiView, language);
                    // save to database
                    await this._unitOfWork.SaveChangesAsync();
                    return Ok(standardSurveyStructure.ToLocalizedModel<SBSurveyViewViewModel>(language));
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            else
            {
                return BadRequest("Incorrect language.");
            }
        }

        [HttpDelete("{surveyId}/DeleteCATIView/{language}")]
        public async Task<IActionResult> DeleteCATIView(int surveyId, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetSurveyLabelsAndPartsAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                // get current standard view structure to duplicate
                SurveyView CATISurveyStructure = this._unitOfWork.SurveyViews.GetSurveyViewQuestionStructure(surveyId, "CATI");
                // add CATI or get existing view
                bool keepView = this._surveyBuilderService.DeleteCATITranslation(CATISurveyStructure, language);
                if (!keepView)
                {
                    this._unitOfWork.SurveyViews.Remove(CATISurveyStructure);
                }
                // save to database
                await this._unitOfWork.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/PageStructure/{surveyViewName}/{language}")]
        [Produces(typeof(SBSurveyViewViewModel))]
        public async Task<IActionResult> GetSurveyViewPageStructure(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var surveyPageStructure = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                return Ok(surveyPageStructure.ToLocalizedModel<SBSurveyViewViewModel>(language));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/PageStructure/{surveyViewName}/UpdateOrder/{pageViewId}")]
        public async Task<IActionResult> UpdateSurveyViewPageOrder(int surveyId, string surveyViewName, int pageViewId, [FromBody] List<SBOrderViewModel> pageOrder)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var surveyPageStructure = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                List<QuestionPartView> newOrder = Mapper.Map<List<QuestionPartView>>(pageOrder);
                this._surveyBuilderService.ReOrderPages(surveyPageStructure, newOrder);
                await this._unitOfWork.SaveChangesAsync();
                var structure = this._unitOfWork.SurveyViews.GetSurveyViewQuestionStructure(surveyId, surveyViewName);

                var page = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(pageViewId);
                if (page.QuestionPartViewChildren.Count > 0)
                {
                    foreach (var questionSkeleton in page.QuestionPartViewChildren)
                    {
                        if (questionSkeleton.QuestionPartViewChildren.Count > 0)
                        {
                            var question = this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructure(questionSkeleton.Id);
                            foreach (var child in question.QuestionPartViewChildren)
                            {
                                this._surveyBuilderService.ValidateConditionals(structure, child.Id);
                            }
                        }
                        else
                        {
                            this._surveyBuilderService.ValidateConditionals(structure, questionSkeleton.Id);
                        }
                    }
                }
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/Part/{surveyViewName}/{parentQuestionPartViewId}/{initialLanguage}")]
        public async Task<IActionResult> AddQuestionPartView(int surveyId, string surveyViewName, int parentQuestionPartViewId, string initialLanguage, [FromBody] SBQuestionPartViewViewModel questionInfo)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    var parentPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(parentQuestionPartViewId);
                    QuestionPartView question;
                    question = await this._unitOfWork.QuestionPartViews.GetAsync(questionInfo.Id);
                    bool fixConditionals = false;
                    if (question == null)
                    {
                        question = Mapper.Map<QuestionPartView>(questionInfo);
                        question.Labels = new LabelCollection<QuestionPartViewLabel>()
                            {
                                new QuestionPartViewLabel()
                                {
                                  Language = initialLanguage,
                                  Value = questionInfo.Label.Value
                                }
                            };
                        //ensure question part name is unique
                        if (question.QuestionPart != null && !this._unitOfWork.Surveys.QuestionNameIsUnique(surveyId, question.QuestionPart.Name, null))
                        {
                            return BadRequest("Question name must be unique");
                        }
                        if (question.QuestionPart != null)
                        {
                            question.QuestionPart.Survey = survey;
                        }
                    }
                    else
                    {
                        //remove question from prior parent and fix order elements
                        fixConditionals = true;
                        var pastParentPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(questionInfo.ParentViewId);
                        this._surveyBuilderService.RemoveQuestionPartView(pastParentPartView, question.Id, true);
                        question.Order = questionInfo.Order;
                    }
                    this._surveyBuilderService.AddQuestionPartView(parentPartView, question);
                    if (question.CATIDependent != null)
                    {
                        question.CATIDependent.Icon = question.Icon;
                        question.CATIDependent.IsHousehold = question.IsHousehold;
                        question.CATIDependent.IsOptional = question.IsOptional;
                        question.CATIDependent.Order = question.Order;
                        question.CATIDependent.ParentView = parentPartView.CATIDependent;
                        question.CATIDependent.QuestionPart = question.QuestionPart;
                        question.CATIDependent.RepeatSource = question.RepeatSource;
                        question.CATIDependent.Labels = new LabelCollection<QuestionPartViewLabel>()
                            {
                                new QuestionPartViewLabel()
                                {
                                  Language = initialLanguage,
                                  Value = questionInfo.CATIDependent.Label.Value
                                }
                            };
                        this._surveyBuilderService.AddQuestionPartView(question.CATIDependent.ParentView, question.CATIDependent);
                    }
                    await this._unitOfWork.SaveChangesAsync();
                    if (fixConditionals)
                    {
                        var structure = this._unitOfWork.SurveyViews.GetSurveyViewQuestionStructure(surveyId, surveyViewName);
                        if (question.QuestionPartViewChildren.Count > 0)
                        {
                            foreach (var child in question.QuestionPartViewChildren)
                            {
                                this._surveyBuilderService.ValidateConditionals(structure, child.Id);
                            }
                        }
                        else
                        {
                            this._surveyBuilderService.ValidateConditionals(structure, question.Id);
                        }
                        await this._unitOfWork.SaveChangesAsync();
                    }
                    return Ok(question.ToLocalizedModel<SBQuestionPartViewViewModel>(initialLanguage));
                }
                else
                {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{surveyId}/Part/{parentQuestionPartViewId}/{childQuestionPartViewId}")]
        public async Task<IActionResult> DeleteQuestionPartView(int surveyId, int parentQuestionPartViewId, int childQuestionPartViewId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var parentQuestionPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(parentQuestionPartViewId);
                this._surveyBuilderService.RemoveQuestionPartView(parentQuestionPartView, childQuestionPartViewId, false);
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else
            {
                return BadRequest("Insufficient permissions.");
            }
        }

        [HttpPut("{surveyId}/Part")]
        public async Task<IActionResult> UpdateQuestionPartViewData(int surveyId, [FromBody] SBQuestionPartViewViewModel updatedQPartView)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    try
                    {
                        var questionPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(updatedQPartView.Id);
                        this._surveyBuilderService.UpdateQuestionPartName(surveyId, questionPartView.QuestionPart, updatedQPartView.QuestionPart?.Name);
                        this._surveyBuilderService.UpdateQuestionPartViewOptions(questionPartView, updatedQPartView.isOptional, updatedQPartView.isHousehold, updatedQPartView.repeatSourceQuestionName, updatedQPartView.Icon);
                        this._surveyBuilderService.SetQuestionPartViewLabel(questionPartView, updatedQPartView.Label.Value, updatedQPartView.Label.Language);
						questionPartView.IsMultiView = updatedQPartView.IsMultiView;

                        if (updatedQPartView.CATIDependent != null) {
                            var catiConnectedQPartView = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(updatedQPartView.CATIDependent.Id);
                            this._surveyBuilderService.UpdateQuestionPartViewOptions(catiConnectedQPartView, updatedQPartView.isOptional, updatedQPartView.isHousehold, updatedQPartView.repeatSourceQuestionName, updatedQPartView.Icon);
                            this._surveyBuilderService.SetQuestionPartViewLabel(catiConnectedQPartView, updatedQPartView.CATIDependent.Label.Value, updatedQPartView.Label.Language);
                        }

                        await this._unitOfWork.SaveChangesAsync();
                        return new OkResult();
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                else
                {
                    return BadRequest("Insufficient permissions.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("{surveyId}/PartStructure/{questionPartViewId}/{language}")]
        [Produces(typeof(SBQuestionPartViewViewModel))]
        public async Task<IActionResult> GetQuestionPartViewStructure(int surveyId, int questionPartViewId, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var questionPartViewStructure = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(questionPartViewId);
                return Ok(questionPartViewStructure.ToLocalizedModel<SBQuestionPartViewViewModel>(language));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }


        [HttpGet("{surveyId}/QuestionConfigurations/{questionPartId}")]
        [Produces(typeof(List<QuestionConfigurationValueViewModel>))]
        public async Task<IActionResult> GetQuestionPartConfigurations(int surveyId, int questionPartId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var questionConfigurations = await this._unitOfWork.QuestionParts.GetQuestionPartConfigurationsAsync(questionPartId);

                return Ok(Mapper.Map<List<QuestionConfigurationValueViewModel>>(questionConfigurations));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/QuestionConfigurations/{questionPartId}")]
        public async Task<IActionResult> UpdateQuestionPartConfigurations(int surveyId, int questionPartId, [FromBody] List<QuestionConfigurationValueViewModel> updatedConfigurations)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    var questionPart = await this._unitOfWork.QuestionParts.GetQuestionPartWithConfigurationsAsync(questionPartId);
                    updatedConfigurations.ForEach(config =>
                    {
                        this._surveyBuilderService.SetQuestionConfiguration(questionPart, config.Name, config.Value);
                    });
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("{surveyId}/QuestionConditionals/{questionPartId}")]
        [Produces(typeof(List<QuestionConditionalViewModel>))]
        public async Task<IActionResult> GetQuestionPartConditionals(int surveyId, int questionPartId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var questionConditionals = await this._unitOfWork.QuestionConditionals.GetQuestionConditionalsAsync(questionPartId);

                return Ok(Mapper.Map<List<QuestionConditionalViewModel>>(questionConditionals));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/QuestionConditionals/{questionPartId}")]
        public async Task<IActionResult> SetQuestionPartConditionals(int surveyId, int questionPartId, [FromBody] List<QuestionConditionalViewModel> conditionals)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    try
                    {
                        var questionPart = await this._unitOfWork.QuestionParts.GetAsync(questionPartId);
                        List<QuestionConditional> newConditionals = Mapper.Map<List<QuestionConditional>>(conditionals);
                        this._surveyBuilderService.SetQuestionConditionals(questionPart, newConditionals);
                        await this._unitOfWork.SaveChangesAsync();
                        return new OkResult();
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("{surveyId}/QuestionOptionConditionals/{questionPartId}")]
        [Produces(typeof(List<QuestionOptionConditionalViewModel>))]
        public async Task<IActionResult> GetQuestionPartOptionConditionals(int surveyId, int questionPartId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var questionOptionConditionals = await this._unitOfWork.QuestionOptionConditionals.GetQuestionOptionConditionalsAsync(questionPartId);

                return Ok(Mapper.Map<List<QuestionOptionConditionalViewModel>>(questionOptionConditionals));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/QuestionOptionConditionals/{questionPartId}")]
        public async Task<IActionResult> SetQuestionPartOptionConditionals(int surveyId, int questionPartId, [FromBody] List<QuestionOptionConditionalViewModel> conditionals)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    try
                    {
                        var questionPart = await this._unitOfWork.QuestionParts.GetAsync(questionPartId);
                        List<QuestionOptionConditional> newConditionals = Mapper.Map<List<QuestionOptionConditional>>(conditionals);
                        this._surveyBuilderService.SetQuestionOptionConditionals(questionPart, newConditionals);
                        await this._unitOfWork.SaveChangesAsync();
                        return new OkResult();
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("{surveyId}/PageStructure/{surveyViewName}/{language}/QuestionsOptions")]
        [Produces(typeof(List<SBPageStructureViewModel>))]
        public async Task<IActionResult> GetSurveyViewPagesWithQuestionsAndOptions(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var pages = this._surveyBuilderService.GetPageStructureWithOptions(surveyId, surveyViewName);
                return Ok(pages.Select(p => p.ToLocalizedModel<SBPageStructureViewModel>(language)));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/QuestionOptions/{questionPartId}/{language}")]
        [Produces(typeof(List<QuestionOptionValueViewModel>))]
        public async Task<IActionResult> GetQuestionPartOptions(int surveyId, int questionPartId, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var questionOptions = await this._unitOfWork.QuestionParts.GetQuestionPartOptionsAsync(questionPartId);

                List<QuestionOptionValueViewModel> questionOptionVMs = new List<QuestionOptionValueViewModel>();

                return Ok(questionOptions?.Select(q => q.ToLocalizedModel<QuestionOptionValueViewModel>(language)));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPost("{surveyId}/QuestionOptions/{questionPartId}")]
        [Produces(typeof(QuestionOptionValueViewModel))]
        public async Task<IActionResult> SetQuestionPartOption(int surveyId, int questionPartId, [FromBody] QuestionOptionValueViewModel newOption)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    try
                    {
                        var questionPart = await this._unitOfWork.QuestionParts.GetQuestionPartWithOptionsAsync(questionPartId);
                        var option = this._surveyBuilderService.SetQuestionOptionLabel(questionPart, newOption.Id, newOption.Code, newOption.Name, newOption.OptionLabel.Value, newOption.OptionLabel.Language);
                        await this._unitOfWork.SaveChangesAsync();
                        return Ok(option.ToLocalizedModel<QuestionOptionValueViewModel>(newOption.OptionLabel.Language));
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost("{surveyId}/QuestionOptions/{questionPartId}/massImport"), DisableRequestSizeLimit]
        public async Task<IActionResult> ImportQuestionPartOptions(int surveyId, int questionPartId)
        {
            try
            {
                var file = Request.Form.Files[0];
                if (Request.Form.ContainsKey("parameters"))
                {
                    QuestionOptionValueViewModel optionParameters = JsonConvert.DeserializeObject<QuestionOptionValueViewModel>(Request.Form["parameters"]);

                    QuestionOptionValueViewModelValidator parameterValidator = new QuestionOptionValueViewModelValidator();
                    ValidationResult validParameters = parameterValidator.Validate(optionParameters);
                    if (validParameters.IsValid)
                    {
                        var questionPart = await this._unitOfWork.QuestionParts.GetQuestionPartWithOptionsAsync(questionPartId);
                        var errorCodes = this._surveyBuilderService.ImportQuestionOptions(questionPart, optionParameters.Name, optionParameters.OptionLabel.Language, file);
                        await this._unitOfWork.SaveChangesAsync();
                        if (errorCodes.Count == 0)
                        {
                            return Ok("success");
                        }
                        else
                        {
                            string code = this._fileDownloader.GenerateFileCode();
                            this._fileDownloader.WriteErrorCodes(code, this.User.Identity.Name, errorCodes);
                            return Ok(code);
                        }
                    }
                    else
                    {
                        AddErrors(validParameters.Errors.Select(e => e.ErrorMessage));
                        return BadRequest(ModelState);
                    }
                }
                else
                {
                    return BadRequest("Missing Import Parameters");
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest("Upload Failed: " + ex.Message);
            }
        }

        [HttpDelete("{surveyId}/QuestionOptions/{questionPartId}/{optionId}")]
        public async Task<IActionResult> DeleteQuestionPartOption(int surveyId, int questionPartId, int optionId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var questionPart = await this._unitOfWork.QuestionParts.GetQuestionPartWithOptionsAsync(questionPartId);
                this._surveyBuilderService.RemoveQuestionOption(questionPart, optionId);
                await this._unitOfWork.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/QuestionOptions/{questionPartId}/Order")]
        public async Task<IActionResult> UpdateQuestionPartOptionsOrder(int surveyId, int questionPartId, [FromBody] List<SBOrderViewModel> updatedOrder)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    var questionPart = await this._unitOfWork.QuestionParts.GetQuestionPartWithOptionsAsync(questionPartId);
                    List<QuestionOption> newOrder = Mapper.Map<List<QuestionOption>>(updatedOrder);
                    this._surveyBuilderService.ReOrderOptions(questionPart, newOrder);
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            return BadRequest(ModelState);
        }

        /// <summary>
        /// Updates the order of question part views
        /// </summary>
        /// <param name="surveyId">Id of the survey</param>
        /// <param name="surveyViewName">Name of Survey View</param>
        /// <param name="questionPartViewId">Id of parent view (page or section)</param>
        /// <param name="questionPartViewMovedId">Id of part view that was moved</param>
        /// <param name="questionOrder">List of updated order of question part views</param>
        /// <returns></returns>
        [HttpPut("{surveyId}/PartStructure/{surveyViewName}/{questionPartViewId}/UpdateOrder/{questionPartViewMovedId}")]
        public async Task<IActionResult> UpdateQuestionPartViewOrder(int surveyId, string surveyViewName, int questionPartViewId, int questionPartViewMovedId, [FromBody] List<SBOrderViewModel> questionOrder)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    var questionPartViewStructure = await this._unitOfWork.QuestionPartViews.GetQuestionPartViewWithStructureAsync(questionPartViewId);
                    List<QuestionPartView> newOrder = Mapper.Map<List<QuestionPartView>>(questionOrder);
                    this._surveyBuilderService.ReOrderQuestions(questionPartViewStructure, newOrder);
                    this._unitOfWork.SaveChanges();
                    var findpartview = questionPartViewStructure.QuestionPartViewChildren.FirstOrDefault(c => c.Id == questionPartViewMovedId);
                    var structure = this._unitOfWork.SurveyViews.GetSurveyViewQuestionStructure(surveyId, surveyViewName);

                    //if a section was moved, validate/update conditionals on child questions; otherwise validate the conditonals on the question
                    if (findpartview.QuestionPartViewChildren.Count > 0)
                    {
                        foreach (var child in findpartview.QuestionPartViewChildren)
                        {
                            this._surveyBuilderService.ValidateConditionals(structure, child.Id);
                        }
                    }
                    else
                    {
                        this._surveyBuilderService.ValidateConditionals(structure, questionPartViewMovedId);
                    }
                    await this._unitOfWork.SaveChangesAsync();
                    return new OkResult();
                }
                else
                {
                    return BadRequest("Insufficient privileges.");
                }
            }
            return BadRequest(ModelState);
        }

        [HttpGet("{surveyId}/Styles")]
        [Produces(typeof(string))]
        public async Task<IActionResult> GetSurveyStyles(int surveyId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                return Ok(survey.StyleTemplate);
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpPut("{surveyId}/Styles")]
        public async Task<IActionResult> UpdateSurveyStyles(int surveyId, [FromBody] string updatedStyles)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                survey.StyleTemplate = updatedStyles;
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/WelcomePage/{surveyViewName}/{language}")]
        [Produces(typeof(WelcomePageLabelViewModel))]
        public async Task<IActionResult> GetWelcomePageLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var welcomePageLabel = await this._unitOfWork.WelcomePageLabels.GetWelcomePageLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<WelcomePageLabelViewModel>(welcomePageLabel));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/ThankYouPage/{surveyViewName}/{language}")]
        [Produces(typeof(ThankYouPageLabelViewModel))]
        public async Task<IActionResult> GetThankYouPageLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var thankYouPageLabel = await this._unitOfWork.ThankYouPageLabels.GetThankYouPageLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<ThankYouPageLabelViewModel>(thankYouPageLabel));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/TermsAndConditionsPage/{surveyViewName}/{language}")]
        [Produces(typeof(TermsAndConditionsPageLabelViewModel))]
        public async Task<IActionResult> GetTermsAndConditionsPageLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var termsAndConditionsPageLabel = await this._unitOfWork.TermsAndConditionsPageLabels.GetTermsAndConditionsPageLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<TermsAndConditionsPageLabelViewModel>(termsAndConditionsPageLabel));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }

        [HttpGet("{surveyId}/ScreeningQuestions/{surveyViewName}/{language}")]
        [Produces(typeof(ScreeningQuestionsLabelViewModel))]
        public async Task<IActionResult> GetScreeningQuestionsLabel(int surveyId, string surveyViewName, string language)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var screeningQuestionsLabel = await this._unitOfWork.ScreeningQuestionsLabels.GetScreeningQuestionsLabelAsync(surveyId, surveyViewName, language);
                return Ok(Mapper.Map<ScreeningQuestionsLabelViewModel>(screeningQuestionsLabel));
            }
            else
            {
                return BadRequest("Insufficient privileges.");
            }
        }


        [HttpPut("{surveyId}/WelcomePage")]
        public async Task<IActionResult> UpdateWelcomePageLabel(int surveyId, [FromBody] WelcomePageLabelViewModel welcomePageLabel)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
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

        [HttpPut("{surveyId}/ThankYouPage")]
        public async Task<IActionResult> UpdateThankYouPageLabel(int surveyId, [FromBody] ThankYouPageLabelViewModel thankYouPageLabel)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
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

        [HttpPut("{surveyId}/TermsAndConditionsPage")]
        public async Task<IActionResult> UpdateTermsAndConditionsPageLabel(int surveyId, [FromBody] TermsAndConditionsPageLabelViewModel termsAndConditionsPageLabel)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
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

        [HttpPut("{surveyId}/ScreeningQuestions")]
        public async Task<IActionResult> UpdateScreeningQuestionsLabel(int surveyId, [FromBody] ScreeningQuestionsLabelViewModel screeningQuestionsLabel)
        {
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
                    ScreeningQuestionsPageLabel screeningQuestionsUpdated = Mapper.Map<ScreeningQuestionsPageLabel>(screeningQuestionsLabel);
                    screeningQuestionsUpdated.SurveyView = this._unitOfWork.SurveyViews.Get(screeningQuestionsUpdated.SurveyViewId);
                    this._unitOfWork.ScreeningQuestionsLabels.Update(screeningQuestionsUpdated);
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

        [HttpPost("{surveyId}/Page/{surveyViewName}/{initialLanguage}")]
        public async Task<IActionResult> AddPage(int surveyId, string surveyViewName, string initialLanguage, [FromBody] SBQuestionPartViewViewModel pageInfo)
        {
            //test
            if (ModelState.IsValid)
            {
                var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
                if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
                {
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

                    if (surveyViewName != "CATI")
                    {
                        var catiView = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, "CATI");
                        if (catiView != null)
                        {
                            newPage.CATIDependent = new QuestionPartView
                            {
                                Icon = newPage.Icon,
                                Order = newPage.Order,
                                Labels = new LabelCollection<QuestionPartViewLabel>()
                            {
                                new QuestionPartViewLabel()
                                {
                                    Language = initialLanguage,
                                    Value = pageInfo.Label.Value
                                }
                            }
                            };

                            this._surveyBuilderService.AddSurveyPage(catiView, newPage.CATIDependent);
                        }
                    }
              
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

        [HttpDelete("{surveyId}/Page/{surveyViewName}/{pageId}")]
        public async Task<IActionResult> DeletePage(int surveyId, string surveyViewName, int pageId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey.Owner == this.User.Identity.Name || await HasModifySurveyPermissions(surveyId))
            {
                var surveyView = await this._unitOfWork.SurveyViews.GetSurveyViewWithPagesStructureAsync(surveyId, surveyViewName);
                this._surveyBuilderService.RemoveSurveyPage(surveyView, pageId);
                await this._unitOfWork.SaveChangesAsync();
                return new OkResult();
            }
            else
            {
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
			if(this.User.IsInRole("super administrator"))
			{
				return true;
			}
            var surveyPermissions = await this._unitOfWork.SurveyPermissions.GetPermissionsForSurveyAsync(this.User.Identity.Name, surveyId);
            bool hasModifySurveyPermissions = surveyPermissions.Permissions.Contains(SurveyPermissions.ModifySurvey.Value);
            return hasModifySurveyPermissions;
        }

        private void AddErrors(IEnumerable<string> errors)
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError(string.Empty, error);
            }
        }
    }
}