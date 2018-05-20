using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
	public class SurveyResponseRepository : Repository<SurveyResponse>, ISurveyResponseRepository
	{

		private DbContext _context;

		public SurveyResponseRepository(DbContext context) : base(context)
		{
			this._context = context;
		}
	}
}
