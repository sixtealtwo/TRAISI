
using DAL;

namespace TRAISI.Controllers.SurveyViewer
{
	/// <summary>
	/// 
	/// </summary>
	public class RespondentController
	{
		
		private IUnitOfWork _unitOfWork;

		private IRespondentService _respondentService;

		public RespondentController (IUnitOfWork unitOfWork) {
			this._unitOfWork = unitOfWork;

		}
	}
}