using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Models.Surveys;

namespace DAL.Models.Surveys {
    public class Shortcode
		{
				public int Id { get; set; }
				public Survey Survey { get; set; }
			//	public PrimaryRespondent Respondent { get; set; }
				public GroupCode GroupCode { get; set; }
				public string Code { get; set; }
				public Boolean IsTest { get; set; }
				public DateTime CreatedDate { get; set; }
		}

	
}
