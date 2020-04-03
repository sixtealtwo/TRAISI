using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Data;
using TRAISI.Data.Models;
using TRAISI.Data.Models.ResponseTypes;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using TRAISI.Authorization;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels.SurveyViewer;
using TRAISI.SDK.Enums;
using System.Collections;

namespace TRAISI.Controllers.SurveyViewer
{
    /// <summary>
    /// 
    /// </summary>
    [Authorize]
    [Authorize(Policy = Policies.RespondToSurveyPolicy)]
    [ApiController]
    [Route("api/[controller]/")]
    public class ResponderController : ControllerBase
    {
        private ISurveyResponseService _respondentService;

        private IRespondentGroupService _respondentGroupService;

        private UserManager<ApplicationUser> _userManager;

        private IUnitOfWork _unitOfWork;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentService"></param>
        /// <param name="respondentGroupService"></param>
        /// <param name="unitOfWork"></param>
        /// <param name="userManager"></param>
        public ResponderController(ISurveyResponseService respondentService,
            IRespondentGroupService respondentGroupService,
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager)
        {
            this._respondentService = respondentService;
            this._userManager = userManager;
            this._respondentGroupService = respondentGroupService;
            this._unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Saves the passed response.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <param name="[ModelBinder(typeof(SurveyRespondentEntityBinder"></param>
        /// <returns></returns>
        [Produces(typeof(bool))]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [HttpPost]
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondentId}/{repeat}", Name = "Save_Response")]
        public async Task<ActionResult<bool>> SaveResponse(int surveyId, int questionId,
            int respondentId, int repeat, [FromBody] JObject content)
        {

            var respondent = await _unitOfWork.SurveyRespondents.GetSurveyRespondentAsync(respondentId);
            var question = await this._unitOfWork.QuestionParts.GetQuestionPartWithConfigurationsAsync(questionId);
            if (respondent == null || question == null || question.Survey.Id != surveyId)
            {
                return new BadRequestResult();
            }

            bool success = await this._respondentService.SaveResponse(question.Survey, question, respondent, content, repeat);
            return new OkObjectResult(success);
        }

        [Produces(typeof(int))]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [HttpGet]
        [Route("surveys/{surveyId}/respondents/primary", Name = "Get_Primary_Respondent_For_Survey")]
        public async Task<ActionResult<PrimaryRespondent>> GetSurveyPrimaryRespondent(int surveyId)
        {
            var survey = await this._unitOfWork.Surveys.GetAsync(surveyId);
            if (survey == null)
            {
                return new NotFoundResult();
            }
            else
            {
                var respondent = await this._unitOfWork.SurveyRespondents.GetPrimaryRespondentForSurveyAsync(survey);

                if (respondent == null)
                {
                    var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
                    var newRespondent = await this._unitOfWork.SurveyRespondents.CreatePrimaryResponentForUserAsnyc(user);
                    newRespondent.Survey = survey;
                    this._unitOfWork.SaveChanges();
                    return new ObjectResult(AutoMapper.Mapper.Map<SurveyRespondentViewModel>(newRespondent));

                }
                else
                {
                    return new ObjectResult(AutoMapper.Mapper.Map<SurveyRespondentViewModel>(respondent));
                }
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        [Produces(typeof(SurveyResponseViewModel))]
        [HttpGet]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondentId}/{repeat}", Name = "SavedResponse")]
        public async Task<ActionResult<SurveyResponseViewModel>> SavedResponse(int surveyId, int questionId, int respondentId, int repeat)
        {

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            SurveyResponse response = await this._respondentService.GetRespondentMostRecentResponseForQuestion(surveyId, questionId, respondentId, repeat, user);

            if (response == null)
            {
                return new ObjectResult(null);
            }

            object mapped = null;
            if (response.ResponseValues.Count > 0)
            {
                switch (response.ResponseValues[0])
                {
                    case TimelineResponse _:
                        mapped = AutoMapper.Mapper.Map<TimelineResponseViewModel>(response);
                        break;
                    case LocationResponse _:
                        mapped = AutoMapper.Mapper.Map<LocationResponseViewModel>(response);
                        break;
                    default:
                        mapped = AutoMapper.Mapper.Map<SurveyResponseViewModel>(response);
                        break;
                }
            }
            else
            {
                mapped = AutoMapper.Mapper.Map<SurveyResponseViewModel>(response);
            }
            return new ObjectResult(mapped);
        }

        /// <summary>
        /// Lists all available responses on a particular survey.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="responseType"></param>
        /// <returns></returns>
        [Produces(typeof(IEnumerable<SurveyResponseViewModel>))]
        [HttpGet]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/responses/types/{responseType}", Name = "List_Responses_By_Question_Type")]
        public async Task<ActionResult<IEnumerable<SurveyResponseViewModel>>> ListResponsesOfType(int surveyId, QuestionResponseType responseType)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var responses = await this._respondentService.ListResponsesOfType(surveyId, responseType, user);
            if (responses == null)
            {
                return new BadRequestResult();
            }
            IList responseViewModel;
            switch (responseType)
            {
                case QuestionResponseType.Location:
                    responseViewModel = AutoMapper.Mapper.Map<List<LocationResponseViewModel>>(responses);
                    break;
                case QuestionResponseType.Timeline:
                    responseViewModel = AutoMapper.Mapper.Map<List<TimelineResponseViewModel>>(responses);
                    break;
                default:
                    responseViewModel = AutoMapper.Mapper.Map<List<SurveyResponseViewModel>>(responses);
                    break;

            }
            return new OkObjectResult(responseViewModel);
        }

        /// <summary>
        /// Adds passed respondent to a survey group.
        /// </summary>
        /// <param name="respondent"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("respondents/groups")]
        public async Task<IActionResult> AddSurveyGroupMember([FromBody] SurveyRespondentViewModel respondent)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var model = AutoMapper.Mapper.Map<SubRespondent>(respondent);
            var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);
            this._respondentGroupService.AddRespondent(group, model);
            await this._unitOfWork.SaveChangesAsync();
            return new ObjectResult(model.Id);
        }

        /// <summary>
        /// Updates a respondent details from a particular group
        /// </summary>
        /// <param name="respondent"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("respondents/groups")]
        public async Task<IActionResult> UpdateSurveyGroupMember([FromBody] SurveyRespondentViewModel respondent)
        {

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            //var model = AutoMapper.Mapper.Map<SubRespondent>(respondent);
            //var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);
            var result = await this._respondentGroupService.UpdateRespondent(respondent, user);
            await this._unitOfWork.SaveChangesAsync();
            return new OkResult();
        }

        /// <summary>
        /// Removes the associated respondent from their belonging survey group.
        /// </summary>
        /// <param name="respondentId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("groups/respondents/{respondentId:" + AuthorizationFields.RESPONDENT + "}/groups", Name = "Remove_Respondent_From_Survey_Group")]
        public async Task<IActionResult> RemoveSurveyGroupMember(
            int respondentId)
        {

            var respondent = await this._unitOfWork.SurveyRespondents.GetAsync(respondentId);
            if (respondent == null)
            {
                return new BadRequestResult();
            }

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);
            await this._respondentGroupService.RemoveRespondent(group, respondent);

            await this._unitOfWork.SaveChangesAsync();

            return new OkResult();
        }

        /// <summary>
        /// Lists survey respondents (including primary) that are part of the passed respondent's group.
        /// </summary>
        /// <param name="AuthorizationFields.RESPONDENT"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("groups/respondents/{respondentId}", Name = "List_Survey_Group_Members")]
        public async Task<IActionResult> ListSurveyGroupMembers(int respondent)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);
            var members = AutoMapper.Mapper.Map<List<SurveyRespondentViewModel>>(group.GroupMembers);
            return new OkObjectResult(members);
        }

        /// <summary>
        /// Lists all responses for specified question ids of the requested user. This is primarily for cache use and other performance
        /// reasons.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionIds"></param>
        /// <param name="respondentId"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("questions/respondents/{respondentId:" + AuthorizationFields.RESPONDENT + "}/responses", Name = "List_Responses_For_Specified_Questions")]
        public async Task<IActionResult> ListSurveyResponsesForQuestions([FromHeader] int surveyId, [FromQuery] int[] questionIds,
            int respondentId)
        {
            var respondent = await this._unitOfWork.SurveyRespondents.GetAsync(respondentId);
            if (respondent == null)
            {
                return new NotFoundObjectResult(new List<SurveyResponse>());
            }
            var result = await this._respondentService.ListSurveyResponsesForQuestionsAsync(new List<int>(questionIds), respondent);

            return new OkObjectResult(result);
        }

        [HttpGet]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("questions/names/respondents/{respondentId:" + AuthorizationFields.RESPONDENT + "}/responses", Name = "List_Responses_For_Specified_Questions_By_Name")]
        public async Task<IActionResult> ListSurveyResponsesForQuestionsByName([FromHeader] int surveyId, [FromQuery] string[] questionNames,
            int respondentId)
        {
            var respondent = await this._unitOfWork.SurveyRespondents.GetAsync(respondentId);
            if (respondent == null)
            {
                return new NotFoundObjectResult(new List<SurveyResponse>());
            }
            var result = await this._respondentService.ListSurveyResponsesForQuestionsByNameAsync(new List<string>(questionNames), respondent);

            return new OkObjectResult(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="respondentId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/respondents/{respondent:" + AuthorizationFields.RESPONDENT + "}", Name = "Delete_All_Responses_For_Survey")]
        public async Task<IActionResult> DeleteAllResponses(int surveyId, [ModelBinder(typeof(SurveyRespondentEntityBinder))] SurveyRespondent respondent)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            await this._respondentService.RemoveAllResponses(surveyId, respondent?.Id ?? -1, user);

            return new OkResult();
        }
    }
}