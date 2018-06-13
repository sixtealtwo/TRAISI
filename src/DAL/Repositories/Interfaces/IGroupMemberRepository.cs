// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Repositories.Interfaces
{
	public interface IGroupMemberRepository : IRepository<GroupMember>
	{
		Task<GroupMember> GetMemberWithInfo(int id);
		Task<bool> IsMemberOfGroup(string username, string groupName);
		Task<bool> IsGroupAdmin (string username, string groupName);
	}
}