using System;
using System.Collections.Generic;
using System.Text;
using TRAISI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using TRAISI.Data.Core;

namespace TRAISI.Data.Models.Surveys
{
    public class SurveyPermission
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public int SurveyId { get; set; }
        public Survey Survey { get; set; }

        public string PermissionCode { get; set; }

        [NotMapped]
        public string[] Permissions
        {
            get
            {
                return SurveyPermissions.ConvertPermissionCodeToList(this.PermissionCode);
            }
            set
            {
                this.PermissionCode = SurveyPermissions.ConvertPermissionsListToCode(value);
            }
        }
    }
}
