using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class TermsAndConditionsPageLabel
    {
        public int Id { get; set; }

        public int LabelId { get; set; }

        public Label Label { get; set; }
    }
}