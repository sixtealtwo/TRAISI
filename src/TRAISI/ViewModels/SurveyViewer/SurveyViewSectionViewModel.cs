using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class SurveyViewSectionViewModel
    {
        public int Id { get; set; }

        public int Order { get; set; }
        public List<QuestionViewModel> Questions { get; set; }

        public string Label { get; set; }

        public string Icon { get; set; }
    }
}