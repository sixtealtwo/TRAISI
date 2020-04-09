using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Groups;

namespace TRAISI.Data.Repositories.Interfaces
{
	public interface IApiKeysRepository : IRepository<ApiKeys>
	{
		Task<ApiKeys> GetGroupApiKeysAsync(int groupId);
	}
}