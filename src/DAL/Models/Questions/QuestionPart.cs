using System.Collections.Generic;
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
        public ICollection<QuestionPart> QuestionPartChildren { get; set; }

		//configuration data related to the use front-end use of, and
		//survey related information.
        public IQuestionConfiguration QuestionConfiguration { get; set; }

		//configuration data related to the use of parameter settings or other back-end
		//values that are unrelated to the actual survey use
		public IQuestionConfiguration QuestionSettings { get; set; }

        public ISurveyView SurveyView { get; set; }
    }
}