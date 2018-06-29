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
            TextLabels = new HashSet<Label>();
            QuestionPartChildren = new HashSet<QuestionPart>();
        }

        public int Id { get; set; }
        public string Text { get; set; }
        public ICollection<Label> TextLabels { get; set; }

        public SurveyResponse Response { get; set; }

        public ICollection<QuestionPart> QuestionPartChildren { get; set; }

        //configuration data related to the use front-end use of, and
        //survey related information.
        public QuestionConfiguration QuestionConfiguration { get; set; }

        //configuration data related to the use of parameter settings or other back-end
        //values that are unrelated to the actual survey use
        public QuestionConfiguration QuestionSettings { get; set; }

        public SurveyView SurveyView { get; set; }

        //Whether this question part is responded to by the respondent group
        public bool IsGroupQuestion { get; set; } = false;

    }
}