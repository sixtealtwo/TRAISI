using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TRAISI.ViewModels
{
    public class TermsAndConditionsPageLabelViewModel
    {
      public int Id { get; set; }
			public int LabelId { get; set; }
      public LabelViewModel Label { get; set; }
			public int SurveyViewId { get; set;}
    }

    public class TermsAndConditionsPageLabelViewModelValidator : AbstractValidator<TermsAndConditionsPageLabelViewModel>
    {
        public TermsAndConditionsPageLabelViewModelValidator()
        {
            
        }
    }
}
