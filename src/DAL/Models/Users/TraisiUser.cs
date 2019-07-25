using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models.Groups;
using DAL.Models.Interfaces;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Identity;

namespace DAL.Models
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
