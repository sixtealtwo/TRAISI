using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class QuestionPartViewViewModel
    {
        public int Id {get;set;}

        public string Label {get ;set;}

        public List<QuestionPartViewViewModel> QuestionChildren;

        public int Order {get;set;}
    }
}