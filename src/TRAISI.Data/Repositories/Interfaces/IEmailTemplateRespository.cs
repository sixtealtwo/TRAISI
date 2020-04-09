using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Groups;

namespace TRAISI.Data.Repositories.Interfaces
{
	public interface IEmailTemplateRepository : IRepository<EmailTemplate>
	{
		Task<IEnumerable<EmailTemplate>> GetGroupEmailTemplatesAsync(int groupId);

        Task<EmailTemplate> GetEmailTemplateWithGroupAsync(int templateId);
	}
}