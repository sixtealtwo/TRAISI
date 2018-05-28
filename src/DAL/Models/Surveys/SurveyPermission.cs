using System;
using System.Collections.Generic;
using System.Text;
using DAL.Core;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models.Surveys
{
    public class SurveyPermission
    {
        public int Id { get; set; }

        public ApplicationUser User { get; set; }

        public Survey Survey { get; set; }

        public string PermissionCode { get; set; }

        [NotMapped]
        public ICollection<string> Permissions
        {
            get
            {
                return ApplicationPermissions.GetAllPermissionValues();
            }
        }
    }
}
