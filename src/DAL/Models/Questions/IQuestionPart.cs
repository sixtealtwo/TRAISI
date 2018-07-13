using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public interface IQuestionPart
    {

        int Id { get; set; }

        string QuestionType { get; set; }


        ICollection<QuestionPart> QuestionPartChildren { get; set; }


        ICollection<QuestionConfiguration> QuestionConfigurations { get; set; }

        ICollection<QuestionOption> QuestionOptions { get; set; }

        bool IsGroupQuestion { get; set; }

    }
}