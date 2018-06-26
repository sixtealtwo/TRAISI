using System;
using System.Collections.Generic;
using System.Text;

using DAL.Core;

namespace DAL.Models
{
    public class UserGroup : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }


        public virtual ApiKeys ApiKeySettings { get; set; }
        public virtual ICollection<GroupMember> Members { get; set; }
    }
}
