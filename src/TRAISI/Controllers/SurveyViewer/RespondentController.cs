
using DAL;
using TRAISI.Services.Interfaces;

namespace TRAISI.Controllers.SurveyViewer
{
	/// <summary>
	/// 
	/// </summary>
	public class RespondentController
	{
		


		private IRespondentService _respondentService;

		public RespondentController (IRespondentService respondentService) {
			this._respondentService = respondentService;

		}
	}
}