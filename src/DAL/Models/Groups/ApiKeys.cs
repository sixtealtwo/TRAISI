using System;
using System.Collections.Generic;
using System.Text;

using DAL.Core;

namespace DAL.Models.Groups
{
    public class ApiKeys : AuditableEntity
    {
        public int Id { get; set; }
        public UserGroup Group { get; set; }
        public string MapBoxApiKey { get; set; }
        public string GoogleMapsApiKey { get; set; }
        public string MailgunApiKey { get; set; }

    }
}
