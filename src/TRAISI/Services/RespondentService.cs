using System.Collections.Generic;
using System.Threading.Tasks;
using DAL;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;
using TRAISI.Services.Interfaces;

namespace TRAISI.Services {
	/// <summary>
	/// Service for handling business logic related to respondents and the updating and querying
	/// of survey responses.
	/// </summary>
	public class RespondentService : IRespondentService
	{
		private IUnitOfWork _unitOfWork;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="_unitOfWork"></param>
		public RespondentService(IUnitOfWork _unitOfWork)
		{
			this._unitOfWork = _unitOfWork;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="shortcode"></param>
		/// <param name="questionId"></param>
		/// <param name="responseData"></param>
		/// <returns></returns>
		public async Task<bool> SaveResponse(int surveyId, string shortcode, int questionId, object responseData)
		{
			SurveyResponse response = new SurveyResponse()
			{
				ResponseValue = new StringResponse()
				{
					Value = "Placeholder"
				}
			};
			await this._unitOfWork.SurveyResponses.AddAsync(response);

			return true;


		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="shortcode"></param>
		/// <param name="questionId"></param>
		/// <param name="responseData"></param>
		/// <returns></returns>
		public async Task<List<SurveyResponse>> ListResponses(int surveyId, string shortcode, int questionId) {

			var responses = await this._unitOfWork.SurveyResponses.GetAllAsync();

			return new List<SurveyResponse>();

		}
	}
}