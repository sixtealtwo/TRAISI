using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories {
	class SurveyViewRepository : Repository<SurveyView>, ISurveyViewRepository
	{

		private DbContext _context;
		public SurveyViewRepository(DbContext context) : base(context)
		{
			this._context = context;
		}
	}
}