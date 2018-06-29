using System.Collections.Generic;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    public class SurveyView
    {
        public int Id { get; set; }

        public Survey Survey { get; set; }

        public ICollection<IQuestionPart> QuestionParts { get; set; }

        public SurveyView()
        {
            this.QuestionParts = new List<IQuestionPart>();
        }
    }
}