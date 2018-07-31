using System.Collections.Generic;
using FluentValidation;

namespace TRAISI.ViewModels.SurveyBuilder
{
    public class SBQuestionPartViewViewModel
    {
        public int Id { get; set; }

        public SBQuestionPartViewModel QuestionPart { get; set; }

				public QuestionPartViewLabelViewModel Label { get; set; }

				public SBQuestionPartViewViewModel ParentView { get; set; }
				
        public List<SBQuestionPartViewViewModel> QuestionPartViewChildren { get; set; }

        public int Order { get; set; }
    }

		public class SBQuestionPartViewViewModelValidator : AbstractValidator<SBQuestionPartViewViewModel>
	{
		public SBQuestionPartViewViewModelValidator()
		{
			RuleFor(part => part.Label).NotNull().WithMessage("Title must not be empty");
		}
	}

}