using DAL.Models.Surveys;
using Newtonsoft.Json;

namespace DAL.Models.Questions
{
    public class QuestionConfigurationLabel : Label
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int QuestionOptionId { get; set; }

        public QuestionOption QuestionOption { get; set; }
    }
}