using System.Collections.Concurrent;
using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
	/// <summary>
	/// View model for a flattened question object - removes the layered part view / part hierarchy
	/// into a model that represents a single component / question on the viewer end
	/// </summary>
	public class QuestionViewModel
	{
		public int Id { get; set; }

		public int QuestionId { get; set; }

		public string Name { get; set; }

		public string Label { get; set; }

		public string QuestionType { get; set; }

		public bool IsOptional { get; set; }

		public bool IsRepeat { get; set; }

		public int RepeatSource { get; set; }

		public int Order { get; set; }

		public bool IsHousehold { get; set; }

		public bool IsMultiView { get; set; }

		public List<SurveyViewConditionalViewModel> SourceConditionals { get; set; }

		public List<SurveyViewConditionalViewModel> TargetConditionals { get; set; }

		public ConcurrentDictionary<string, object> Configuration { get; set; }
	}
}