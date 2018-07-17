
using DAL;

namespace TRAISI.Controllers.SurveyViewer
{
	/// <summary>
	/// 
	/// </summary>
	public class RespondentController
	{
		
		private IUnitOfWork _unitOfWork;

		public RespondentController (IUnitOfWork unitOfWork) {
			this._unitOfWork = unitOfWork;

		}
	}
}