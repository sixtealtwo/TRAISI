
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models.Surveys
{
	public interface ISurvey
	{

        int Id { get; set; }
         string Owner { get; set; }
         string Group { get; set; }
         DateTime StartAt { get; set; }
         DateTime EndAt { get; set; }
         bool IsActive { get; set; }
         bool IsOpen { get; set; }
         string SuccessLink { get; set; }
         string RejectionLink { get; set; }
         string DefaultLanguage { get; set; }
         string StyleTemplate { get; set; }
		 ICollection<Label> TitleLabel {get;set;}
		 
		string Name{get;set;}
	}
}