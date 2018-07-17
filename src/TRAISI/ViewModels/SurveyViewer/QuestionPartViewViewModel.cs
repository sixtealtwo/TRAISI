using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class QuestionPartViewModel
    {
        public int Id {get;set;}

        public string Label {get ;set;}

        public List<QuestionPartViewModel> QuestionChildren;

        public int Order {get;set;}
    }
}