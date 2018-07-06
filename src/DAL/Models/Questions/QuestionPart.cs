using System.Collections.Generic;
using DAL.Models.ResponseTypes;
using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    /**
	 * 
	 */
    public class QuestionPart : IQuestionPart
    {

        public QuestionPart()
        {

            QuestionPartChildren = new HashSet<QuestionPart>();
            QuestionOptions = new HashSet<QuestionOption>();
            QuestionConfigurations = new HashSet<QuestionConfiguration>();
        }

        public int Id { get; set; }
        public string Text { get; set; }


        public ICollection<QuestionPart> QuestionPartChildren { get; set; }


        public ICollection<QuestionConfiguration> QuestionConfigurations { get; set; }

        public ICollection<QuestionOption> QuestionOptions { get; set; }


        public SurveyView SurveyView { get; set; }

        //Whether this question part is responded to by the respondent group
        public bool IsGroupQuestion { get; set; } = false;

    }
}