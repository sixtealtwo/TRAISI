using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DAL.Repositories
{
	public class SurveyRespondentRepository : Repository<SurveyRespondent>, ISurveyRespondentRepository
	{
		public SurveyRespondentRepository(DbContext context) : base(context)
		{

		}

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="user"></param>
		/// <returns></returns>
		public async Task<PrimaryRespondent> GetPrimaryRespondentForUserAsync(ApplicationUser user)
		{
			var respondent = await this._appContext.PrimaryRespondents.Where(r => r.User == user)
			.Include(s => s.SurveyRespondentGroup)
			.ThenInclude(s => s.GroupMembers)
			.Include(s => s.Shortcode)
			.FirstOrDefaultAsync();

			if (respondent == null)
			{
				return await this.CreatePrimaryResponentForUserAsnyc(user);
			}
			else
			{
				return respondent;
			}
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="respondentId"></param>
		/// <returns></returns>
		public async Task<SurveyRespondent> GetSubRespondentAsync(int respondentId)
		{
			return await this._appContext.SurveyRespondents.Where(r => r.Id == respondentId)
			.Include(s => s.SurveyRespondentGroup)
			.ThenInclude(s => s.GroupMembers)
			.FirstOrDefaultAsync();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="user"></param>
		/// <returns></returns>
		public async Task<PrimaryRespondent> CreatePrimaryResponentForUserAsnyc(ApplicationUser user)
		{
			PrimaryRespondent respondent = new PrimaryRespondent()
			{
				User = user,
				SurveyRespondentGroup = new SurveyRespondentGroup(),
				SurveyAccessRecords = new List<SurveyAccessRecord>() { new SurveyAccessRecord() }
			};

			if (user is SurveyUser surveyUser)
			{
				surveyUser.PrimaryRespondent = respondent;

			}

			this._entities.Add(respondent);
			await this._appContext.SaveChangesAsync();

			return respondent;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="surveyId"></param>
		/// <returns></returns>
		public async Task<PrimaryRespondent> GetPrimaryRespondentForSurveyAsync(Survey survey)
		{
			var respondent = await this._appContext.PrimaryRespondents.Where(p => p.Survey == survey)
			.FirstOrDefaultAsync();
			return respondent;
		}
	}
}