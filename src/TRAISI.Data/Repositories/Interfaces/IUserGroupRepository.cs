
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Models.Groups;

namespace DAL.Repositories.Interfaces
{
	public interface IUserGroupRepository : IRepository<UserGroup>
	{
		Tuple<bool, string[]> AddUserAsync(GroupMember newMember);
		Task<UserGroup> GetGroupWithMembersAsync(int id);
		Task<IEnumerable<UserGroup>> GetAllGroupsWhereMemberAsync(string username);
		Task<IEnumerable<UserGroup>> GetAllGroupsForAdminAsync(string username);
		Task<IEnumerable<UserGroup>> GetAllGroupsAsync();
		Task<IEnumerable<Tuple<GroupMember, string[]>>> GetGroupMembersInfoAsync(int groupID);
		Task<UserGroup> GetGroupByNameAsync(string groupName);
	}
}