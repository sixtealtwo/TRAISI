using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TRAISI.ViewModels
{
    public class SurveyViewModel
    {
        public int Id { get; set; }
        public int Code { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string Group { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public Boolean IsActive { get; set; }
        public Boolean IsOpen { get; set; }
        public string SuccessLink { get; set; }
        public string RejectionLink { get; set; }
        public string DefaultLanguage { get; set; }
        public string StyleTemplate { get; set; }

				public ICollection<SurveyPermissionViewModel> SurveyPermissions {get; set;}
    }
    
    public class SurveyViewModelValidator : AbstractValidator<SurveyViewModel>
    {
        public SurveyViewModelValidator()
        {
            RuleFor(register => register.Name).NotEmpty().WithMessage("Survey name cannot be empty");
            RuleFor(register => register.StartAt).NotEmpty().WithMessage("Survey must have a start date");
            RuleFor(register => register.EndAt).NotEmpty().WithMessage("Survey must have an end date");
        }
    }
}
