using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TRAISI.ViewModels.Questions
{
    public class QuestionOptionDefinitionViewModel
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string ValueType { get; set; }

        public string DefaultValue { get; set; }

        public bool IsMultipleAllowed { get; set; }

    }
}
