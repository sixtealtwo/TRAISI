using System.Collections.Generic;
using DAL.Models.Extensions;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    public interface ISurveyView
    {
        int Id { get; set; }
        string ViewName { get; set; }
        Survey Survey { get; set; }
        
        ICollection<QuestionPartView> QuestionPartViews { get; set; }
        LabelCollection<WelcomePageLabel> WelcomePageLabels { get; set; }
        
        LabelCollection<TermsAndConditionsPageLabel> TermsAndConditionsLabels { get; set; }
        LabelCollection<ThankYouPageLabel> ThankYouPageLabels { get; set; }


    }
}