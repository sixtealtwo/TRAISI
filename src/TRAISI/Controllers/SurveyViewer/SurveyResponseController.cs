
using DAL;

namespace TRAISI.Controllers.SurveyViewer
{
	/// <summary>
	/// 
	/// </summary>
	public class SurveyResponseController
	{
		
		private IUnitOfWork _unitOfWork;

		public SurveyResponseController (IUnitOfWork unitOfWork) {
			this._unitOfWork = unitOfWork;

		}
	}
}