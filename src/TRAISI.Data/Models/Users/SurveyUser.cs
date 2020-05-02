using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Traisi.Data.Models.Groups;
using Traisi.Data.Models.Interfaces;
using Traisi.Data.Models.Surveys;
using Microsoft.AspNetCore.Identity;

namespace Traisi.Data.Models {
	public class SurveyUser : ApplicationUser {
		public Shortcode Shortcode { get; set; }

		public PrimaryRespondent PrimaryRespondent { get; set; }

		public SurveyUser () {
		
		}

	}
}