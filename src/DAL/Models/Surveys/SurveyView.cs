using System.Collections.Generic;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    public class SurveyView : ISurveyView
    {
        public int Id { get; set; }

        public Survey Survey { get; set; }

        public ICollection<QuestionPart> QuestionParts { get; set; }
				public ICollection<WelcomePageLabel> WelcomePageLabel { get; set; }
				public ICollection<TermsAndConditionsLabel> TermsAndConditionsLabel { get; set; }
				public ICollection<ThankYouPageLabel> ThankYouPageLabel { get; set; }

        public string ViewName { get; set; }

        public SurveyView()
        {
            this.QuestionParts = new List<QuestionPart>();
        }
    }
}