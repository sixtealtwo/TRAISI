using System.Collections.Generic;
using DAL.Models.Extensions;
using DAL.Models.Interfaces;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    public class SurveyView : ISurveyView, IEntity
    {
        public int Id { get; set; }

        public Survey Survey { get; set; }

        public ICollection<QuestionPartView> QuestionPartViews { get; set; }
        public LabelCollection<WelcomePageLabel> WelcomePageLabels { get; set; }
        public LabelCollection<TermsAndConditionsPageLabel> TermsAndConditionsLabels { get; set; }
        public LabelCollection<ThankYouPageLabel> ThankYouPageLabels { get; set; }

        public string ViewName { get; set; }

        public SurveyView()
        {
            this.QuestionPartViews = new List<QuestionPartView>();
            
            
        }
    }
}