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
	public class GroupCodeRepository : Repository<GroupCode>, IGroupCodeRepository
	{
		public GroupCodeRepository(ApplicationDbContext context) : base(context) { }

		public GroupCodeRepository(DbContext context) : base(context) { }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// Get all groupcodes for survey
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="isTest"></param>
		/// <returns></returns>
		public async Task<IEnumerable<GroupCode>> GetGroupCodesForSurvey(int surveyId, bool isTest)
		{
			return await _appContext.GroupCode
							.Where(s => s.Survey.Id == surveyId && s.IsTest == isTest)
							.OrderByDescending(sc => sc.CreatedDate)
							.ToListAsync();
		}

		/// <summary>
		/// Check if group code in given survey is unique
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="code"></param>
		/// <returns></returns>
		public bool isUniqueGroupCodeForSurvey(int surveyId, string code)
		{
			return _appContext.GroupCode
							.Where(g => g.Survey.Id == surveyId && g.Code == code)
							.Any();
		}
		
  }
}