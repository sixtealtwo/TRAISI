using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
using DAL.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using TRAISI.Authorization;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels.SurveyViewer;

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
        private IResponderService _respondentService;

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
        public ResponderController(IResponderService respondentService,
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
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondent:" + AuthorizationFields.RESPONDENT + "}", Name = "Save_Response")]
        public async Task<ActionResult<bool>> SaveResponse(int surveyId, int questionId,
         int respondent,
         [FromBody] JObject content)
        {

            int respondentId = respondent;

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            bool success = await this._respondentService.SaveResponse(surveyId, questionId, user, respondentId, content, 0);

            return new OkObjectResult(success);
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

            if (response == null) {
                return new ObjectResult(null);
            }
            var mapped = AutoMapper.Mapper.Map<SurveyResponseViewModel>(response);
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
        public async Task<ActionResult<IEnumerable<SurveyResponseViewModel>>> ListResponsesOfType(int surveyId, string responseType)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            var responses = await this._respondentService.ListResponsesOfType(surveyId, responseType, user);
            if (responses == null) {
                return new BadRequestResult();
            }
            var mapped = AutoMapper.Mapper.Map<List<SurveyResponseViewModel>>(responses);
            return new OkObjectResult(mapped);
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
            if (respondent == null) {
                return new BadRequestResult();
            }

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);
            this._respondentGroupService.RemoveRespondent(group, respondent);

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
        [Route("groups/respondents/{respondent:" + AuthorizationFields.RESPONDENT + "}", Name = "List_Survey_Group_Members")]
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
        [Route("questions/respondents/{respondent:" + AuthorizationFields.RESPONDENT + "}/responses", Name = "List_Responses_For_Specified_Questions")]
        public async Task<IActionResult> ListSurveyResponsesForQuestions([FromHeader] int surveyId, [FromQuery] int[] questionIds,
         [ModelBinder(Name = AuthorizationFields.RESPONDENT)] SurveyRespondent respondent)
        {
            var result = await this._respondentService.ListSurveyResponsesForQuestionsAsync(new List<int>(questionIds), respondent?.Id ?? -1);

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
        public async Task<IActionResult> DeleteAllResponses(int surveyId,
        [ModelBinder(typeof(SurveyRespondentEntityBinder))] SurveyRespondent respondent)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            await this._respondentService.RemoveAllResponses(surveyId, respondent?.Id ?? -1, user);

            return new OkResult();
        }
    }
}