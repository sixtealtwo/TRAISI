using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Groups;

namespace DAL.Repositories.Interfaces
{
	public interface IEmailTemplateRepository : IRepository<EmailTemplate>
	{
		Task<IEnumerable<EmailTemplate>> GetGroupEmailTemplatesAsync(int groupId);

        Task<EmailTemplate> GetEmailTemplateWithGroupAsync(int templateId);
	}
}