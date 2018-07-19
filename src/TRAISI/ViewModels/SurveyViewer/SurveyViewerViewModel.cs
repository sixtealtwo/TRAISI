using System.Collections.Generic;
using TRAISI.ViewModels;
using TRAISI.ViewModels.SurveyViewer;

namespace TRAISI.ViewModels.SurveyViewer

{
    public class SurveyViewerViewModel
    {
        public int Id {get;set;}

        public string ViewName { get; set; }
				public SurveyViewModel Survey {get; set; }

        public List<QuestionPartViewViewModel> Questions;

				public WelcomePageLabelViewModel WelcomePageLabels;

				public TermsAndConditionsPageLabelViewModel TermsAndConditionsPageLaels;

				public ThankYouPageLabelViewModel ThankYouPageLabelViewModel;

    }
}