using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class TermsAndConditionsPageLabel: Label
    {
        public int Id { get; set; }

        public int SurveyViewId { get; set; }

        public SurveyView SurveyView { get; set; }
    }
}