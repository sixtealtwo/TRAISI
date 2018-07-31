using DAL.Models.Extensions;

namespace DAL.Models.Questions {
	public class QuestionOption : IQuestionOption {
		public int Id { get; set; }


		public string Name { get; set; }

		public LabelCollection<QuestionOptionLabel> QuestionOptionLabels { get; set; }

		public string Description { get; set; }

		public int Order { get; set; }

		public QuestionOption() {
			QuestionOptionLabels = new LabelCollection<QuestionOptionLabel>();
		}
	}
}