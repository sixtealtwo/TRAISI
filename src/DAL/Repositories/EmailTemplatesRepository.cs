using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DAL.Models;
using DAL.Models.Groups;
using DAL.Repositories.Interfaces;

namespace DAL.Repositories
{
	public class EmailTemplatesRepository : Repository<EmailTemplate>, IEmailTemplateRepository
	{
		public EmailTemplatesRepository(ApplicationDbContext context) : base(context)
		{ }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// Gets all email templates for a given group
		/// </summary>
		/// <param name="groupId"></param>
		/// <returns></returns>
		public async Task<IEnumerable<EmailTemplate>> GetGroupEmailTemplatesAsync(int groupId)
		{
			return await _appContext.EmailTemplates
					.Where(s => s.Group.Id == groupId)
					.ToListAsync();
		}


	}
}
