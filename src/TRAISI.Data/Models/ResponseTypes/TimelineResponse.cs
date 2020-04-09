using System;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes {
	/// <summary>
	/// 
	/// </summary>
	public class TimelineResponse : LocationResponse, ITimelineResponse {

		public string Purpose { get; set; }

		public string Name { get; set; }

		public DateTimeOffset TimeA { get; set; }

		public DateTimeOffset TimeB { get; set; }

		public int? Order { get; set; }
	}
}