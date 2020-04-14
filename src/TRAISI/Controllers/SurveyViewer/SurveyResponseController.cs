using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using TRAISI.Authorization;
using TRAISI.Data;
using TRAISI.Data.Models;
using TRAISI.Data.Models.ResponseTypes;
using TRAISI.Data.Models.Surveys;
using TRAISI.Data.Repositories;
using TRAISI.SDK.Enums;
using TRAISI.Services.Interfaces;
using TRAISI.ViewModels.SurveyViewer;

namespace TRAISI.Controllers.SurveyViewer
{

    [ApiController]
    [Route("api/[controller]/")]
    public class SurveyResponseController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private IUnitOfWork _unitOfWork;
        private ISurveyResponseService _resonseService;
        public SurveyResponseController(IUnitOfWork unitOfWork, ISurveyResponseService responseService, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _resonseService = responseService;
            _userManager = userManager;
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

            bool success = await this._resonseService.SaveResponse(question.Survey, question, respondent, content, repeat);
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

            SurveyResponse response = await this._resonseService.GetRespondentMostRecentResponseForQuestion(surveyId, questionId, respondentId, repeat, user);

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
            var responses = await this._resonseService.ListResponsesOfType(surveyId, responseType, user);
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
            var result = await this._resonseService.ListSurveyResponsesForQuestionsAsync(new List<int>(questionIds), respondent);

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
            var result = await this._resonseService.ListSurveyResponsesForQuestionsByNameAsync(new List<string>(questionNames), respondent);

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

            await this._resonseService.RemoveAllResponses(surveyId, respondent?.Id ?? -1, user);

            return new OkResult();
        }


    }
}