using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public class QuestionPartViewLabel
    {
        public int Id { get; set; }

        public QuestionPartView QuestionPartView { get; set; }

        public Label Label { get; set; }
    }
}