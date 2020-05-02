using Traisi.Data.Models.Surveys;
using Newtonsoft.Json;

namespace Traisi.Data.Models.Questions
{
    public class QuestionConfigurationLabel : Label
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int QuestionOptionId { get; set; }

        public QuestionOption QuestionOption { get; set; }
    }
}