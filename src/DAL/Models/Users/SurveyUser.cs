using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models.Groups;
using DAL.Models.Interfaces;
using DAL.Models.Surveys;
using Microsoft.AspNetCore.Identity;

namespace DAL.Models
{
	public class SurveyUser : ApplicationUser
	{
		public Shortcode Shortcode { get; set; }

		public SurveyRespondent PrimaryRespondent { get; set; }



	}
}
