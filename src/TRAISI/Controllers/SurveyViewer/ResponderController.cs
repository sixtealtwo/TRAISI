using System;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
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
    [Route("api/[controller]")]
    public class ResponderController : Controller
    {
        private IRespondentService _respondentService;

        private UserManager<ApplicationUser> _userManager;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentService"></param>
        public ResponderController(IRespondentService respondentService,
                                    UserManager<ApplicationUser> userManager)
        {
            this._respondentService = respondentService;
            this._userManager = userManager;
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
        [Route("surveys/{surveyId}/questions/{questionId}/")]
        public async Task<IActionResult> SaveResponse(int surveyId, int questionId, [FromBody] JObject content)
        {

            var user = await _userManager.GetUserAsync(User);

            bool success = await this._respondentService.SaveResponse(surveyId, questionId, user, content);

            if (!success) {
                return new BadRequestResult();
            }

            return new OkResult();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        [Produces(typeof(ObjectResult))]
        [HttpGet]
        [Route("surveys/{surveyId}/questions/{questionId}/")]
        public async Task<IActionResult> SavedResponse(int surveyId, int questionId)
        {

            var user = await _userManager.GetUserAsync(User);

            SurveyResponse response = await this._respondentService.GetRespondentMostRecentResponseForQuestion(surveyId, questionId, user);

            if (response == null) {
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
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/questions/{questionId}/responses/")]
        public async Task<IActionResult> GetResponses(int surveyId, string questionName)
        {
            var responses = await this._respondentService.ListResponses(surveyId, questionName);
            if (responses != null) {
                return new BadRequestResult();
            }

            return new OkResult();
        }
    }
}