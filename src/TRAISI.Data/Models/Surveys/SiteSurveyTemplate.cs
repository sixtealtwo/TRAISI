using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class SiteSurveyTemplate: AuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string HTML { get; set; }
				public string CSS { get; set; }
    }
}
