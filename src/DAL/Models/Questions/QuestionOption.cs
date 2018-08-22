using DAL.Models.Extensions;
using DAL.Models.Interfaces;

namespace DAL.Models.Questions {
	public class QuestionOption : IQuestionOption, IEntity {
		public int Id { get; set; }


		public string Name { get; set; }

		public LabelCollection<QuestionOptionLabel> QuestionOptionLabels { get; set; }

		public int Order { get; set; }

		public QuestionOption() {
			QuestionOptionLabels = new LabelCollection<QuestionOptionLabel>();
		}
	}
}