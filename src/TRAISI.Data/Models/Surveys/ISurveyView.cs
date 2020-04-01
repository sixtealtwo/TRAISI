using System.Collections.Generic;
using TRAISI.Data.Models.Extensions;
using TRAISI.Data.Models.Questions;

namespace TRAISI.Data.Models.Surveys
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

        LabelCollection<ScreeningQuestionsPageLabel> ScreeningQuestionLabels { get; set; }
    }
}