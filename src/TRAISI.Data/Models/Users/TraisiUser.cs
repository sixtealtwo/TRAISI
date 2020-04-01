using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TRAISI.Data.Models.Groups;
using TRAISI.Data.Models.Interfaces;
using TRAISI.Data.Models.Surveys;
using Microsoft.AspNetCore.Identity;

namespace TRAISI.Data.Models
{
    public class TraisiUser : ApplicationUser
    {


        /// <summary>
        /// Navigation property for the groups this user belongs to.
        /// </summary>
        public virtual ICollection<GroupMember> Groups { get; set; }

        public virtual ICollection<SurveyPermission> SurveyPermissions { get; set; }
    }
}
