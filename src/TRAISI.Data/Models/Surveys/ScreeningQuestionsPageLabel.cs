using TRAISI.Data.Models.Surveys;
using Newtonsoft.Json;

namespace TRAISI.Data.Models.Surveys
{
    public class ScreeningQuestionsPageLabel: Label
    {
        [JsonIgnore]
        public int Id { get; set; }

        [JsonIgnore]
        public int SurveyViewId { get; set; }

        public SurveyView SurveyView { get; set; }
    }
}