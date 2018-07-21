using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyBuilder
{
    public class SBQuestionPartViewViewModel
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public List<SBQuestionPartViewViewModel> QuestionPartViewChildren;

        public int Order { get; set; }
    }
}