using DAL.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Survey : AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string Group { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsOpen { get; set; }
        public string SuccessLink { get; set; }
        public string RejectionLink { get; set; }
        public string DefaultLanguage { get; set; }
        public string StyleTemplate { get; set; }

    }
}
