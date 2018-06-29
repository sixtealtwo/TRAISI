using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public interface IQuestionPart
    {

        int Id { get; set; }

        [NotMapped]
        string Text { get; set; }

        ICollection<Label> TextLabels { get; set; }

        ICollection<QuestionPart> QuestionPartChildren { get; set; }

        QuestionConfiguration QuestionConfiguration { get; set; }

		QuestionConfiguration QuestionSettings{get;set;}

        SurveyResponse Response{get;set;}

        SurveyView SurveyView { get; set; }

        bool IsGroupQuestion {get;set;}

    }
}