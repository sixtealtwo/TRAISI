using System;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Interfaces;

namespace DAL.Models.Surveys {
	/// <summary>
	/// Label items, store most alterable and dynamic text fields.
	/// </summary>
	public class SurveyAccessRecord : AuditableEntity, ISurveyAccessRecord {

		public int Id { get; set; }

		[Column (TypeName = "jsonb")]
		public string QueryParams { get; set; }
		public DateTime AccessDateTime { get; set; }
		public string UserAgent { get; set; }
		public string RemoteIpAddress { get; set; }
		public string RequestUrl { get; set; }
		public PrimaryRespondent Respondent { get; set; }
		public ApplicationUser AccessUser { get; set; }

	}
}