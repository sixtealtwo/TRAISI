using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public class QuestionOptionLabel: Label
    {
				public int Id { get; set; }
        public int QuestionOptionId { get; set; }

        public QuestionOption QuestionOption { get; set; }

    }
}