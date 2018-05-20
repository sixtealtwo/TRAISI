using DAL.Models.Surveys;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories {
	public class SurveyResponseRepository : Repository<SurveyResponse>, ISurveyResponseRepository {

		public SurveyResponseRepository (DbContext context) : base (context) {

		}
	}
}