using System.Collections.Generic;
using TRAISI.Data.Models.Extensions;
using TRAISI.Data.Models.Surveys;

namespace TRAISI.Data.Models.Questions
{
    public interface IQuestionPartView
    {
        int Id { get; set; }

        LabelCollection<QuestionPartViewLabel> Labels { get; set; }

        ICollection<QuestionPartView> QuestionPartViewChildren { get; set; }

        QuestionPart QuestionPart { get; set; }

        QuestionPartView ParentView { get; set; }

        SurveyView SurveyView { get; set; }

		/// <summary>
		/// Flag for whether or not this view (Section normally) will render its child views on the same
		/// or separate pages in the survey viewer.
		/// </summary>
		/// <value></value>
		bool IsMultiView {get;set;}

        bool IsOptional { get; set; }
        bool IsHousehold { get; set; }
		QuestionPart RepeatSource { get; set; }

        string Icon { get; set; }

        int Order { get; set; }
    }
}