using DAL;
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
	}
}