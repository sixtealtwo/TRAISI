using DAL.Models.Surveys;

namespace DAL.Models.Surveys
{
    public class WelcomePageLabel
    {
        public int Id { get; set; }

        public int LabelId { get; set; }

        public Label Label { get; set; }
    }
}