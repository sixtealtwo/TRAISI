using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class SurveyViewPageViewModel
    {
        public int Id { get; set; }
        
        public List<QuestionPartViewViewModel> Questions { get; set; }
        
        public int Order { get; set; }
    }
}