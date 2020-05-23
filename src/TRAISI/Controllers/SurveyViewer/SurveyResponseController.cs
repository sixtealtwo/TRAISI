using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Traisi.Authorization;
using Traisi.Models.ViewModels;
using Traisi.Data;
using Traisi.Data.Models;
using Traisi.Data.Models.ResponseTypes;
using Traisi.Data.Models.Surveys;
using Traisi.Data.Repositories;
using Traisi.Sdk.Enums;
using Traisi.Services.Interfaces;
using Traisi.ViewModels.SurveyViewer;
using AutoMapper;
using Traisi.Models.Surveys.Validation;

namespace Traisi.Controllers.SurveyViewer
{

    [ApiController]
    [Route("api/[controller]/")]
    public class SurveyResponseController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private IUnitOfWork _unitOfWork;
        private ISurveyResponseService _resonseService;
        private readonly IMapper _mapper;
        public SurveyResponseController(IUnitOfWork unitOfWork, ISurveyResponseService responseService,
        UserManager<ApplicationUser> userManager,
        IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _resonseService = responseService;
            _userManager = userManager;
            this._mapper = mapper;
        }

        /// <summary>
        /// Saves the passed response.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <param name="[ModelBinder(typeof(SurveyRespondentEntityBinder"></param>
        /// <returns></returns>
        [Produces(typeof(SurveyViewerValidationStateViewModel))]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [HttpPost]
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondentId}/{repeat}", Name = "Save_Response")]
        public async Task<ActionResult<SurveyViewerValidationStateViewModel>> SaveResponse(int surveyId, int questionId,
            int respondentId, int repeat, [FromBody] JArray content, [FromHeader] string language)
        {

            var respondent = await _unitOfWork.SurveyRespondents.GetSurveyRespondentAsync(respondentId);
            var question = await this._unitOfWork.QuestionParts.GetQuestionPartWithConfigurationsAsync(questionId);
            if (respondent == null || question == null || question.Survey.Id != surveyId)
            {
                return new BadRequestResult();
            }

            SurveyResponseValidationState validationState = await this._resonseService.SaveResponse(question.Survey, question, respondent, content, repeat);
            var mappedState = _mapper.Map<SurveyViewerValidationStateViewModel>(validationState, opts =>
            {
                opts.Items["Language"] = language;
            });
            return new OkObjectResult(mappedState);
        }
        /// <summary>
        /// 
        /// /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        [Produces(typeof(SurveyResponseViewModel))]
        [HttpGet]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/questions/{questionId}/respondents/{respondentId}/{repeat}", Name = "SavedResponse")]
        public async Task<ActionResult<SurveyResponseViewModel>> GetResponse(int surveyId, int questionId, int respondentId, int repeat)
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
                        mapped = _mapper.Map<TimelineResponseViewModel>(response);
                        break;
                    case LocationResponse _:
                        mapped = _mapper.Map<LocationResponseViewModel>(response);
                        break;
                    default:
                        mapped = _mapper.Map<SurveyResponseViewModel>(response);
                        break;
                }
            }
            else
            {
                mapped = _mapper.Map<SurveyResponseViewModel>(response);
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
                    responseViewModel = _mapper.Map<List<LocationResponseViewModel>>(responses);
                    break;
                case QuestionResponseType.Timeline:
                    responseViewModel = _mapper.Map<List<TimelineResponseViewModel>>(responses);
                    break;
                default:
                    responseViewModel = _mapper.Map<List<SurveyResponseViewModel>>(responses);
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
        [ProducesResponseType(typeof(List<SurveyResponseViewModel>), StatusCodes.Status200OK)]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("questions/respondents/{respondentId:" + AuthorizationFields.RESPONDENT + "}/responses", Name = "List_Responses_For_Specified_Questions")]
        public async Task<IActionResult> ListSurveyResponsesForQuestions([FromHeader] int surveyId, [FromQuery] int[] questionIds,
            int respondentId)
        {
            var respondent = await this._unitOfWork.SurveyRespondents.GetAsync(respondentId);
            if (respondent == null)
            {
                return new NotFoundObjectResult(new List<SurveyResponseViewModel>());
            }
            var responses = await this._resonseService.ListSurveyResponsesForQuestionsAsync(new List<int>(questionIds), respondent);
            return new OkObjectResult(_mapper.Map<List<SurveyResponseViewModel>>(responses));
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

        [HttpGet]
        [Produces(typeof(SurveyCompletionStatus))]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("completion-status/primary-respondents/{respondentId}")]
        public async Task<IActionResult> GetSurveyCompletionStatus(int surveyId, int respondentId)
        {

            return new OkResult();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="respondentId"></param>
        /// <returns></returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/respondents/{respondentId}", Name = "Delete_All_Responses_For_Survey")]
        public async Task<IActionResult> DeleteAllResponses(int surveyId, int respondentId)
        {
            var user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            await this._resonseService.RemoveAllResponses(surveyId, respondentId, user);
            return new OkResult();
        }


    }
}