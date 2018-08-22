using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TRAISI.ViewModels.Questions
{
    public class QuestionOptionValueViewModel
    {
				public int Id { get; set; }
        public string Name { get; set; }
				public QuestionOptionLabelViewModel OptionLabel { get; set; }
				public int Order { get; set; }
    }
}
