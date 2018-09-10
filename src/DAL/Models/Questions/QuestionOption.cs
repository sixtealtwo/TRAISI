using DAL.Models.Extensions;
using DAL.Models.Interfaces;
using DAL.Core;
using System.Collections.Generic;

namespace DAL.Models.Questions {
	public class QuestionOption : IQuestionOption, IEntity {
		public int Id { get; set; }

		public string Name { get; set; }

		public LabelCollection<QuestionOptionLabel> QuestionOptionLabels { get; set; }

		public int Order { get; set; }

        public ICollection<QuestionOptionConditional> QuestionOptionConditionalsTarget { get; set; }

        public int QuestionPartId { get; set; }

		public QuestionOption() {
			QuestionOptionLabels = new LabelCollection<QuestionOptionLabel>();
		}

    }
}