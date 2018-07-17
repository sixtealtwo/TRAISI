using System.Collections.Generic;

namespace TRAISI.ViewModels
{
    public class SurveyViewViewModel
    {
        public int Id {get;set;}

        public string ViewName {get;set;}

        public List<QuestionPartViewModel> Questions;
    }
}