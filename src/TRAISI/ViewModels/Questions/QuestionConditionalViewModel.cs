using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace TRAISI.ViewModels.Questions
{
    public class QuestionConditionalViewModel
    {
		public int Id { get; set; }
        public int TargetQuestionId { get; set; }
        public int SourceQuestionId { get; set; }
        public string Condition { get; set; }
        public string Value { get; set; }
    }

    public class QuestionConditionalViewModelValidator : AbstractValidator<QuestionConditionalViewModel>
    {
        public QuestionConditionalViewModelValidator()
        {
            RuleFor(q => q.TargetQuestionId).NotEmpty().WithMessage("Condition target must be specified");
            RuleFor(q => q.SourceQuestionId).NotEmpty().WithMessage("Condition source must be specified");
            RuleFor(q => q.Condition).NotEmpty().WithMessage("Condition must be specified");
            RuleFor(q => q.Value).NotEmpty().WithMessage("Condition value must be specified");
        }
    }
}
