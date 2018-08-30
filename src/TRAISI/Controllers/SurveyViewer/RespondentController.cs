using System.Threading.Tasks;
using DAL;
using DAL.Models;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Mvc;
using TRAISI.Services.Interfaces;

namespace TRAISI.Controllers.SurveyViewer {
	/// <summary>
	/// 
	/// </summary>
	[Route("api/[controller]")]
	public class RespondentController {
		private IRespondentService _respondentService;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="respondentService"></param>
		public RespondentController(IRespondentService respondentService) {
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
		[Route("surveys/{surveyId}/questions/{questionId}/responses/")]
		public async Task<IActionResult> SaveResponse(int surveyId, int questionId, [FromBody] string shortCode) {
			bool success = await this._respondentService.SaveResponse(surveyId, shortCode, questionId, null);

			if (!success) {
				return new BadRequestResult();
			}

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
		[Route("surveys/{surveyId}/questions/{questionId}/responses/")]
		public async Task<IActionResult> GetResponses(int surveyId, int questionId, [FromBody] string shortCode) {
			var responses = await this._respondentService.ListResponses(surveyId, shortCode, questionId);

			if (responses != null) {
				return new BadRequestResult();
			}

			return new OkResult();
		}
	}
}