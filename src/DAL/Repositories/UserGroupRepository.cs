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
	public class UserGroupRepository : Repository<UserGroup>, IUserGroupRepository
	{
		public UserGroupRepository(ApplicationDbContext context) : base(context)
		{ }

		private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

		/// <summary>
		/// Add user to survey group
		/// </summary>
		/// <param name="newMember">GroupMember object with Group variable populated</param>
		public Tuple<bool, string[]> AddUser(GroupMember newMember)
		{
			Tuple<bool, string[]> result;
			try
			{
				newMember.User = _appContext.Users.Single(r => r.UserName == newMember.UserName);
				var group = _appContext.UserGroups
						.Where(g => g.Name == newMember.Group)
						.Include(g => g.Members)
						.Single();
				newMember.UserGroup = group;
				if (group.Members == null)
				{
					group.Members = new List<GroupMember>();
				}
				if (group.Members.Where(m => m.UserName == newMember.UserName).Count() == 0)
				{
					//add member info to group members repo
					//_appContext.GroupMembers.Add(newMember);
					//_appContext.SaveChanges();
					//add member to group members list
					group.Members.Add(newMember);
					_appContext.GroupMembers.Add(newMember);
				}
				else
				{
					throw new Exception("Member " + newMember.UserName + " already exists in group: " + group.Name);
				}
				result = Tuple.Create(true, new string[] { "Success" });
			}
			catch (Exception ex)
			{
				result = Tuple.Create(false, new string[] { ex.Message });
			}
			return result;
		}

		public void RemoveUser(GroupMember currentMember)
		{
			throw new NotImplementedException();
		}

		public void UpdateUser(GroupMember member)
		{
			throw new NotImplementedException();
		}

		public async Task<IEnumerable<UserGroup>> GetAllGroupsWhereMemberAsync(string username)
		{
			return await _appContext.GroupMembers
					.Where(m => m.UserName == username)
					.Include(m => m.UserGroup)
					.Select(m => m.UserGroup)
					.OrderBy(g => g.Name)
					.ToListAsync();
		}

		public async Task<IEnumerable<UserGroup>> GetAllGroupsForAdminAsync(string username)
		{
			return await _appContext.GroupMembers
					.Where(m => m.UserName == username && m.GroupAdmin)
					.Include(m => m.UserGroup)
					.Select(m => m.UserGroup)
					.OrderBy(g => g.Name)
					.ToListAsync();
		}

		public async Task<IEnumerable<UserGroup>> GetAllGroupsAsync()
		{
			return await _appContext.UserGroups
					//.Include(c => c.Members).ThenInclude(o => o.User).ThenInclude(u=>u.Roles)
					.OrderBy(c => c.Name)
					.ToListAsync();
		}

		public async Task<IEnumerable<Tuple<GroupMember, string[]>>> GetGroupMembersInfoAsync(int groupID)
		{
			var group = await _appContext.UserGroups
					.Where(g => g.Id == groupID)
					.Include(g => g.Members).ThenInclude(m => m.User).ThenInclude(u => u.Roles)
					.OrderBy(g => g.Name)
					.SingleAsync();

			var roleDict = _appContext.Roles.ToDictionary(r => r.Id, r => r.Name);

			return group.Members.Select(m => Tuple.Create(m, m.User.Roles.Select(r => roleDict[r.RoleId]).ToArray())).ToList();
		}
	}
}
