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
	public class ShortcodeRepository : Repository<Shortcode>, IShortcodeRepository
	{
		public ShortcodeRepository(ApplicationDbContext context) : base(context) { }

		public ShortcodeRepository(DbContext context) : base(context) { }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;
		

		/// <summary>
		/// Get all shortcodes for survey
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="isTest"></param>
		/// <returns></returns>
		public async Task<IEnumerable<Shortcode>> GetShortcodesForSurvey(int surveyId, bool isTest)
		{
			return await _appContext.Shortcode
							.Where(s => s.Survey.Id == surveyId && s.IsTest == isTest)
							.OrderByDescending(sc => sc.CreatedDate)
							.ToListAsync();
		}

		/// <summary>
		/// Check if shortcode in given survey is unique
		/// </summary>
		/// <param name="surveyId"></param>
		/// <param name="code"></param>
		/// <returns></returns>
		public bool UniqueShortCodeForSurvey(int surveyId, string code)
		{
			return _appContext.Shortcode
							.Where(s => s.Survey.Id == surveyId && s.Code == code)
							.Any();
		}

    }
}