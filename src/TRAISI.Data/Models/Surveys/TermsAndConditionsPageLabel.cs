using Traisi.Data.Models.Surveys;
using Newtonsoft.Json;

namespace Traisi.Data.Models.Surveys
{
    public class TermsAndConditionsPageLabel: Label
    {
        [JsonIgnore]
        public int Id { get; set; }

        [JsonIgnore]
        public int SurveyViewId { get; set; }

        public SurveyView SurveyView { get; set; }
    }
}