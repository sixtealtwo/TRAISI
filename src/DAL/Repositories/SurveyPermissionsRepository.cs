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
	public class SurveyPermissionsRepository : Repository<SurveyPermission>, ISurveyPermissionsRepository
	{
		public SurveyPermissionsRepository(ApplicationDbContext context) : base(context) { }

		public SurveyPermissionsRepository(DbContext context) : base(context) { }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// Get user's permissions for given survey
		/// </summary>
		/// <param name="userName"></param>
		/// <param name="surveyID"></param>
		/// <returns></returns>
		public async Task<SurveyPermission> GetPermissionsForSurvey(string userName, int surveyID)
		{
			return await _appContext.SurveyPermissions
							.Where(sp => sp.User.UserName == userName && sp.Survey.Id == surveyID)
							.SingleOrDefaultAsync();
		}

	}
}