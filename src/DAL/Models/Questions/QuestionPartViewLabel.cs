using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public class QuestionPartViewLabel: Label
    {
        public int Id { get; set; }

        public QuestionPartView QuestionPartView { get; set; }

    }
}