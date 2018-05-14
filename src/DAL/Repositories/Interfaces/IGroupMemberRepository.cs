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
    public interface IGroupMemberRepository: IRepository<GroupMember>
    {
        //Task<IEnumerable<GroupMember>> GetAllMembersInGroup(int groupID);
    }
}
