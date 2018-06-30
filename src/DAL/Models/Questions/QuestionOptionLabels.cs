using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public class QuestionOptionLabels
    {
        public int QuestionOptionId { get; set; }

        public QuestionOption QuestionOption { get; set; }

        public int LabelId { get; set; }

        public Label Label { get; set; }
    }
}