using System.Collections.Generic;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    public interface ISurveyView
    {
        int Id { get; set; }
        string ViewName { get; set; }
        Survey Survey { get; set; }
        ICollection<QuestionPartView> QuestionPartViews { get; set; }
        ICollection<WelcomePageLabel> WelcomePageLabel { get; set; }
        
        ICollection<TermsAndConditionsPageLabel> TermsAndConditionsLabel { get; set; }
        ICollection<ThankYouPageLabel> ThankYouPageLabel { get; set; }


    }
}