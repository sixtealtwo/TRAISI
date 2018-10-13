using DAL.Models.Surveys;
using Newtonsoft.Json;

namespace DAL.Models.Questions {
	public class QuestionOptionLabel : Label {
        [JsonIgnore]
        public int Id { get; set; }
        [JsonIgnore]
        public int QuestionOptionId { get; set; }

		public QuestionOption QuestionOption { get; set; }
	}
}