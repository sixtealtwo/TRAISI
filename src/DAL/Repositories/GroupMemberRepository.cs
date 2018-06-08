// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories {
	public class GroupMemberRepository : Repository<GroupMember>, IGroupMemberRepository {
		public GroupMemberRepository (ApplicationDbContext context) : base (context) { }

		private ApplicationDbContext _appContext => (ApplicationDbContext) _context;

		public async Task<bool> IsMemberOfGroup(string username, string groupName)
		{
			int number = await _appContext.GroupMembers
				.Where(gm => gm.UserName == username && gm.Group == groupName)
				.CountAsync();
			
			return number == 1;
		}
	}
}