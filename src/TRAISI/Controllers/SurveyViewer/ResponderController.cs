using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
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
    [Route("api/[controller]")]
    public class ResponderController : Controller
    {
        private IResponderService _respondentService;

        private IRespondentGroupService _respondentGroupService;

        private UserManager<ApplicationUser> _userManager;

        private IUnitOfWork _unitOfWork;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentService"></param>
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
        /// Save a new response for the associated user (shortcode)
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <param name="shortCode"></param>
        /// <returns></returns>
        [Produces(typeof(ObjectResult))]
        [HttpPost]
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondentId}/{repeat?}")]
        public async Task<IActionResult> SaveResponse(int surveyId, int questionId, int respondentId, [FromBody] JObject content, int repeat = 0)
        {

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            bool success = await this._respondentService.SaveResponse(surveyId, questionId, user, respondentId, content, repeat);

            return new OkObjectResult(success);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        [Produces(typeof(ObjectResult))]
        [HttpGet]
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondentId}/{repeat}")]
        public async Task<IActionResult> SavedResponse(int surveyId, int questionId, int respondentId, int repeat)
        {

            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            SurveyResponse response = await this._respondentService.GetRespondentMostRecentResponseForQuestion(surveyId, questionId, respondentId, repeat, user);

            if (response == null)
            {
                return new ObjectResult(null);
            }
            var mapped = AutoMapper.Mapper.Map<SurveyResponseViewModel>(response);
            return new ObjectResult(mapped);
        }


        /// <summary>
        /// Retrieve the list of responses belonging to a particular user for a specific question.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <param name="shortCode"></param>
        /// <returns></returns>
        [Produces(typeof(ObjectResult))]
        [HttpGet]
        [Route("surveys/{surveyId}/questions/{questionId}/responses/")]
        public async Task<IActionResult> GetResponses(int surveyId, string questionName)
        {
            var responses = await this._respondentService.ListResponses(surveyId, questionName);
            if (responses != null)
            {
                return new BadRequestResult();
            }

            return new OkResult();
        }

        [Produces(typeof(ObjectResult))]
        [HttpGet]
        [Route("surveys/{surveyId}/responses/types/{responseType}")]
        public async Task<IActionResult> ListResponsesOfType(int surveyId, string responseType)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);


            var responses = await this._respondentService.ListResponsesOfType(surveyId, responseType, user);
            if (responses == null)
            {
                return new BadRequestResult();
            }
            var mapped = AutoMapper.Mapper.Map<List<SurveyResponseViewModel>>(responses);
            return new OkObjectResult(mapped);
        }


        [HttpPost]
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

        [HttpPut]
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


        [HttpDelete]
        [Route("respondents/groups/{respondentId}")]
        public async Task<IActionResult> RemoveSurveyGroupMember(int respondentId)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);
            this._respondentGroupService.RemoveRespondent(group, respondentId);

            await this._unitOfWork.SaveChangesAsync();

            return new OkResult();
        }




        [HttpGet]
        [Route("respondents/groups")]
        public async Task<IActionResult> GetSurveyGroupMembers()
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            var group = await this._respondentGroupService.GetSurveyRespondentGroupForUser(user);

            var members = AutoMapper.Mapper.Map<List<SurveyRespondentViewModel>>(group.GroupMembers);


            return new OkObjectResult(members);
        }


        [HttpGet]
        [Route("questions/respondents/{respondentId}/responses")]
        public async Task<IActionResult> ListSurveyResponsesForQuestionsAsync([FromHeader] int surveyId, [FromQuery] int[] questionIds, int respondentId)
        {
            var result = await this._respondentService.ListSurveyResponsesForQuestionsAsync(new List<int>(questionIds), respondentId);

            return new OkObjectResult(result);
        }


        [HttpDelete]
        [Route("surveys/{surveyId}/respondents/{respondentId}")]
        public async Task<IActionResult> DeleteAllResponses(int surveyId, int respondentId)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);

            await this._respondentService.RemoveAllResponses(surveyId, respondentId, user);

            return new OkResult();
        }
    }
} 