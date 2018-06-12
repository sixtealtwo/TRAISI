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
	public class SurveyRepository : Repository<Survey>, ISurveyRepository
	{
		public SurveyRepository(ApplicationDbContext context) : base(context) { }

		public SurveyRepository(DbContext context) : base(context) { }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// Loads a survey and all associated objects from a given inputstream with JSON data
		/// </summary>
		/// <param name="data"></param>
		/// <returns></returns>
		public async void LoadSurveyFromJson(Stream data)
		{
			await this.AddAsync(new Survey());
		}

        /// <summary>
        /// Gets all surveys owned by a specific user
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetAllUserSurveys(string userName)
        {
            return await _appContext.Surveys
                .Where(s => s.Owner == userName)
                .Include(s => s.SurveyPermissions)
                .OrderByDescending(g => g.CreatedDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets all surveys owned by a specific group
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetAllGroupSurveys(string groupName)
        {
            return await _appContext.Surveys
                .Where(s => s.Group == groupName)
                .OrderByDescending(g => g.CreatedDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets all surveys owned by other members of a specific group
        /// with permission for specific user
        /// </summary>
        /// <param name="groupName">name of group</param>
        /// <param name="exceptUserName">user to exclude from list</param>
        /// <returns></returns>
        public async Task<IEnumerable<Survey>> GetAllGroupSurveys(string groupName, string exceptUserName)
        {
            return await _appContext.Surveys
                .Where(s => s.Group == groupName && s.Owner != exceptUserName)
                .Include(s => s.SurveyPermissions)
                .OrderByDescending(g => g.CreatedDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets a survey with its permissions
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Survey> GetSurveyWithPermissions(int id)
        {
            return await _appContext.Surveys
                .Where(s => s.Id == id)
                .Include(s => s.SurveyPermissions)
                .FirstOrDefaultAsync();
        }
    }
}