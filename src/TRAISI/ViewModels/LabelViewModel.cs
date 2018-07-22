using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TRAISI.ViewModels
{
    public class LabelViewModel
    {
			 public string Value { get; set; }
       public string Language { get; set; }
    }

    public class LabelViewModelValidator : AbstractValidator<LabelViewModel>
    {
        public LabelViewModelValidator()
        {
            
        }
    }
}
