using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class ThankYouPageLabel
    {
        public int Id { get; set; }

        public int LabelId { get; set; }

        public Label Label { get; set; }

				public int SurveyViewId { get; set;}
				
				public SurveyView SurveyView { get; set; }
    }
}