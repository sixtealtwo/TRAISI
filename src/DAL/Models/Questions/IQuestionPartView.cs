using System.Collections.Generic;
using DAL.Models.Extensions;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public interface IQuestionPartView
    {
        int Id { get; set; }

        LabelCollection<QuestionPartViewLabel> Labels { get; set; }

        ICollection<QuestionPartView> QuestionPartViewChildren { get; set; }

        QuestionPart QuestionPart { get; set; }

        QuestionPartView ParentView { get; set; }

        SurveyView SurveyView { get; set; }


        bool isOptional { get; set; }
        bool isHousehold { get; set; }
        bool isRepeat { get; set; }

        int Order { get; set; }
    }
}