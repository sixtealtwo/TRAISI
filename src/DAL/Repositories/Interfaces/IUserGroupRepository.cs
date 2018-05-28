// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;

namespace DAL.Repositories.Interfaces {
	public interface IUserGroupRepository : IRepository<UserGroup> {
		Tuple<bool, string[]> AddUser (GroupMember newMember);
		void RemoveUser (GroupMember currentMember);
		void UpdateUser (GroupMember member);

		Task<IEnumerable<UserGroup>> GetAllGroupsWhereMemberAsync (string username);
		Task<IEnumerable<UserGroup>> GetAllGroupsAsync();
		Task<IEnumerable<Tuple<GroupMember, string[]>> > GetGroupMembersInfoAsync (int groupID);
	}
}