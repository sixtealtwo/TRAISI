using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TRAISI.ViewModels
{
    public class ThankYouPageLabelViewModel
    {
      public int Id { get; set; }
			public int LabelId { get; set; }
      public LabelViewModel Label { get; set; }
			public int SurveyViewId { get; set;}
    }

    public class ThankYouPageLabelViewModelValidator : AbstractValidator<ThankYouPageLabelViewModel>
    {
        public ThankYouPageLabelViewModelValidator()
        {
            
        }
    }
}
