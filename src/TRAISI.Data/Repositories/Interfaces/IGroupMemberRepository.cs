using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TRAISI.Data.Models;
using TRAISI.Data.Models.Groups;

namespace TRAISI.Data.Repositories.Interfaces
{
	public interface IGroupMemberRepository : IRepository<GroupMember>
	{
		Task<GroupMember> GetMemberWithInfoAsync(int id);
		Task<bool> IsMemberOfGroupAsync(string username, string groupName);
		Task<bool> IsGroupAdminAsync (string username, string groupName);
	}
}