using System.Collections.Generic;
using TRAISI.Data.Models.Extensions;
using TRAISI.Data.Models.Interfaces;
using TRAISI.Data.Models.Questions;
using Newtonsoft.Json;

namespace TRAISI.Data.Models.Surveys
{
    public class SurveyView : ISurveyView, IEntity
    {
        [JsonIgnore]
        public int Id { get; set; }

        public Survey Survey { get; set; }

        [JsonIgnore]
        public int SurveyId { get; set; }

        public ICollection<QuestionPartView> QuestionPartViews { get; set; }
        public LabelCollection<WelcomePageLabel> WelcomePageLabels { get; set; }
        public LabelCollection<TermsAndConditionsPageLabel> TermsAndConditionsLabels { get; set; }
        public LabelCollection<ThankYouPageLabel> ThankYouPageLabels { get; set; }

        public LabelCollection<ScreeningQuestionsPageLabel> ScreeningQuestionLabels { get; set; }

        public string ViewName { get; set; }

        public SurveyView()
        {
            this.QuestionPartViews = new List<QuestionPartView>();
            
            
        }
    }
}