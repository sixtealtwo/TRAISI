using System.Collections.Generic;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    public interface ISurveyView
    {
        int Id { get; set; }

        Survey Survey { get; set; }

        ICollection<QuestionPart> QuestionParts { get; set; }
    }
}