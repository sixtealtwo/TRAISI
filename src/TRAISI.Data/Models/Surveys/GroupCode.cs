using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TRAISI.Data.Core;
using TRAISI.Data.Models.Surveys;

namespace TRAISI.Data.Models.Surveys {
    public class Groupcode
		{
				public int Id { get; set; }
				public Survey Survey { get; set; }
				public string Name { get; set; }
				public string Code { get; set; }
				public DateTime CreatedDate { get; set; }
				public Boolean IsTest { get; set; }
		}

	
}
