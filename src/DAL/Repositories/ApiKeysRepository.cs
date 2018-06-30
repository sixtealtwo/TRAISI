// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
	public class ApiKeysRepository : Repository<ApiKeys>, IApiKeysRepository
	{
		public ApiKeysRepository(ApplicationDbContext context) : base(context)
		{ }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// Gets API keys for a given group
		/// </summary>
		/// <param name="groupId"></param>
		/// <returns></returns>
		public async Task<ApiKeys> GetGroupApiKeysAsync(int groupId)
		{

			return await _appContext.ApiKeys
					.Where(s => s.Group.Id == groupId)
					.SingleOrDefaultAsync();
		}


	}
}
