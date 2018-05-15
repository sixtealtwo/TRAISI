// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories.Interfaces
{
    public interface IUserGroupRepository : IRepository<UserGroup>
    {
        Tuple<bool,string[]> AddUser(GroupMember newMember);
        void RemoveUser(GroupMember currentMember);
        void UpdateUser(GroupMember member);

        Task<IEnumerable<UserGroup>> GetAllGroupInfoAsync();
        Task<IEnumerable<Tuple<GroupMember,string[]>>> GetGroupMembersInfoAsync(int groupID);
    }
}
