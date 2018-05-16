using System.Collections.Generic;

namespace DAL.Models
{
    public class SurveyView
    {
        public int Id { get; set; }

        public ICollection<QuestionPart> QuestionParts {get;set;}
    }
}