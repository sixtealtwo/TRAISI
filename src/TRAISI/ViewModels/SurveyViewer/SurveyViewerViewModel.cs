using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class SurveyViewerViewModel
    {
        public int Id {get;set;}

        public string ViewName {get;set;}

        public List<QuestionPartViewViewModel> Questions;
    }
}