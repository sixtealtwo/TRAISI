using System.Collections.Generic;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class SurveyViewerViewModel
    {
        public int Id {get;set;}

        public string ViewName {get;set;}

        public List<QuestionPartViewModel> Questions;

        public string TitleText {get;set;}

        public string TermsAndConditionsText {get;set;}

        public string WelcomeText{get;set;}

        public string SurveyCompletionText {get;set;}
    }
}