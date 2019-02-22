using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;


namespace DAL.Repositories
{
	public class SurveyUserRepository : Repository<SurveyUser>, ISurveyUserRepository
	{

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
		public SurveyUserRepository(DbContext context) : base(context)
		{
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="survey"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		public async Task<SurveyUser> GetSurveyUserAsync(Survey survey, string shortcode)
		{

			return await this._appContext.SurveyUsers.Where(u => u.Shortcode.Code == shortcode &&
			u.Shortcode.Survey == survey).FirstOrDefaultAsync();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="shortcode"></param>
		/// <returns></returns>
		public async Task<SurveyUser> GetSurveyUserAsync(int surveyId, string shortcode)
		{

			return await this._appContext.SurveyUsers.Where(u => u.Shortcode.Code == shortcode &&
			u.Shortcode.Survey.Id == surveyId).FirstOrDefaultAsync();
		}
	}

}