using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories {
	class SurveyViewRepository : Repository<SurveyView>, ISurveyViewRepository
	{

		public SurveyViewRepository(DbContext context) : base(context)
		{
	
		}
	}
}