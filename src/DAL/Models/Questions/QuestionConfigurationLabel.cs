using DAL.Models.Surveys;

namespace DAL.Models.Questions
{
    public class QuestionConfigurationLabel : Label
    {
        public int Id { get; set; }
        public int QuestionOptionId { get; set; }

        public QuestionOption QuestionOption { get; set; }
    }
}