using System.Collections.Generic;
using FluentValidation;

namespace TRAISI.ViewModels.SurveyBuilder
{
    public class SBQuestionPartViewViewModel
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public List<SBQuestionPartViewViewModel> QuestionPartViewChildren;

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