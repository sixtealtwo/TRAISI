using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TRAISI.ViewModels.Questions
{
    public class SBQuestionTypeDefinitionViewModel
    {
        public string TypeName { get; set; }

        public Dictionary<string, QuestionOptionDefinitionViewModel> QuestionOptions { get; set; }

        public Dictionary<string, QuestionConfigurationDefinitionViewModel> QuestionConfigurations { get; set; }

        public string Icon { get; set; }
    }
}
