using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories {
	class SurveyViewRepository : Repository<SurveyView>, ISurveyViewRepository
	{
		private DbContext _context;

		public SurveyViewRepository(DbContext context) : base(context)
		{
			this._context = _context;

		}
		
		private ApplicationDbContext _appContext => (ApplicationDbContext) _context;

		/// <summary>
		/// Returns the list of survey views that belong to the specified survey with the passed id.
		/// </summary>
		/// <param name="surveyId">The survey id</param>
		/// <returns>(async) A list of all relevent SurveyView objects</returns>
		public Task<List<SurveyView>> GetSurveyViews(int surveyId)
		{
			return _context.Set<SurveyView>().Include(sv=>sv.Survey)
				.Where(sv => sv.Survey.Id == surveyId).ToListAsync();
		}
	}
}