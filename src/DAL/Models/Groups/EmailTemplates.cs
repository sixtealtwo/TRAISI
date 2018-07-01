using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Models.Groups
{
    public class EmailTemplate: AuditableEntity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string HTML { get; set; }
        public UserGroup Group { get; set; }
    }
}
