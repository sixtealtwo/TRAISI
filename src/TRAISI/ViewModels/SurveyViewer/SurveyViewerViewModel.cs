using System.Collections.Generic;
<<<<<<< HEAD

namespace TRAISI.ViewModels.SurveyViewer
=======
using TRAISI.ViewModels;
using TRAISI.ViewModels.SurveyViewer;

namespace TRAISI.ViewModels.SurveyViewer

>>>>>>> 2566f760b1f9a289df0a3bf9222f581b79a15dbc
{
    public class SurveyViewerViewModel
    {
        public int Id { get; set; }

        public string ViewName { get; set; }

<<<<<<< HEAD
        public List<QuestionPartViewModel> Questions;

        public string WelcomeText {get;set;}

        public string TermsAndConditionsText {get;set;}

        public string CompletionText{get;set;}
=======
        public SurveyViewModel Survey { get; set; }

        public List<QuestionPartViewViewModel> Questions;

        public string TitleText { get; set; }

        public string TermsAndConditionsText { get; set; }

        public string WelcomeText { get; set; }

        public string SurveyCompletionText { get; set; }
>>>>>>> 2566f760b1f9a289df0a3bf9222f581b79a15dbc
    }
}