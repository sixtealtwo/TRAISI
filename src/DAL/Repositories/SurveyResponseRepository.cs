using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories {
	public class SurveyResponseRepository : Repository<SurveyResponse>, ISurveyResponseRepository {

		public SurveyResponseRepository (DbContext context) : base (context) {

			

		}
		
		/// <summary>
		/// 
		/// </summary>
		/// <param name="questionId"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		public async Task<List<SurveyResponse>> ListQuestionResponsesForRespondentAsync(int questionId, string shortcode) {

			return await this._entities.ToListAsync();
		}
		
		
	}
}