using System.Collections.Generic;
using FluentValidation;

namespace TRAISI.ViewModels.SurveyBuilder
{
    public class SBQuestionPartViewViewModel
    {
			public int Id { get; set; }

			public SBQuestionPartViewModel QuestionPart { get; set; }

			public QuestionPartViewLabelViewModel Label { get; set; }

			public int ParentViewId { get; set; }
					
			public List<SBQuestionPartViewViewModel> QuestionPartViewChildren { get; set; }

			public int Order { get; set; }

			public bool isOptional { get; set; }
			public bool isHousehold { get; set; }
			public bool isRepeat { get; set; }
    }

		public class SBQuestionPartViewViewModelValidator : AbstractValidator<SBQuestionPartViewViewModel>
	{
		public SBQuestionPartViewViewModelValidator()
		{
			RuleFor(part => part.Label).NotNull().WithMessage("Title must not be empty");
            RuleFor(part => part.Label.Value).NotEmpty().WithMessage("Text cannot be empty").When(p => p.Label != null);
            RuleFor(part => part.QuestionPart).SetValidator(new SBQuestionPartViewModelValidator()).When(p => p.QuestionPart != null);
		}
	}

}