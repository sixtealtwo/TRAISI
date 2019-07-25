using DAL.Models.Surveys;
using Newtonsoft.Json;

namespace DAL.Models.Questions
{
    public class QuestionPartViewLabel: Label
    {
        [JsonIgnore]
        public int Id { get; set; }

        public QuestionPartView QuestionPartView { get; set; }
        [JsonIgnore]
        public int QuestionPartViewId { get; set; }

    }
}