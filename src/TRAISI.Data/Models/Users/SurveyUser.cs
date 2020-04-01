using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TRAISI.Data.Models.Groups;
using TRAISI.Data.Models.Interfaces;
using TRAISI.Data.Models.Surveys;
using Microsoft.AspNetCore.Identity;

namespace TRAISI.Data.Models {
	public class SurveyUser : ApplicationUser {
		public Shortcode Shortcode { get; set; }

		public PrimaryRespondent PrimaryRespondent { get; set; }

		public SurveyUser () {
		
		}

	}
}