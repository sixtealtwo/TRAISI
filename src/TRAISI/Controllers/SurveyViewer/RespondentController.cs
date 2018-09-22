using System;
using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TRAISI.Authorization;
using TRAISI.Services.Interfaces;

namespace TRAISI.Controllers.SurveyViewer
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/[controller]")]
    public class RespondentController
    {
        private IRespondentService _respondentService;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="respondentService"></param>
        public RespondentController(IRespondentService respondentService)
        {
            this._respondentService = respondentService;
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
        [Route("surveys/{surveyId}/questions/{questionId}/respondent/{shortcode}/responses/")]
        public async Task<IActionResult> SaveResponse(int surveyId, int questionId, string shortcode)
        {
            bool success = await this._respondentService.SaveResponse(surveyId, shortcode, questionId, null);

            if (!success)
            {
                return new BadRequestResult();
            }

            return new OkResult();
        }

        [Produces(typeof(ObjectResult))]
        [HttpPost]
        [Authorize(Policy = Policies.RespondToSurveyPolicy)]
        [Route("surveys/{surveyId}/questions/{questionId}/respondent/{shortcode}/")]
        public async Task<IActionResult> SaveStringResponse(int surveyId, int questionId)
        {
            Console.WriteLine("here");

            return new OkResult();
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
            if (responses != null)
            {
                return new BadRequestResult();
            }

            return new OkResult();
        }
    }
}