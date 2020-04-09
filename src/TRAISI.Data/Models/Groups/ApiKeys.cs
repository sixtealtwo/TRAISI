using System;
using System.Collections.Generic;
using System.Text;

using TRAISI.Data.Core;

namespace TRAISI.Data.Models.Groups
{
    public class ApiKeys : AuditableEntity
    {
        public int Id { get; set; }
		public int GroupId { get; set;}
        public UserGroup Group { get; set; }
        public string MapBoxApiKey { get; set; }
        public string GoogleMapsApiKey { get; set; }
        public string MailgunApiKey { get; set; }

    }
}
