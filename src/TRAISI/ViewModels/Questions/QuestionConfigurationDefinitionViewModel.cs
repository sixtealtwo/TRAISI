using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TRAISI.ViewModels.Questions
{
    public class QuestionConfigurationDefinitionViewModel
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string ValueType { get; set; }

        public string BuilderType { get; set; }

        public string DefaultValue { get; set; }
    }
}
