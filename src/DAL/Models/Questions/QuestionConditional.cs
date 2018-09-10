using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;
using DAL.Core;

namespace DAL.Models.Questions
{
    /// <summary>
    /// Conditional data for a question
    /// </summary>
    public class QuestionConditional
    {
        public int Id { get; set; }
        public int TargetQuestionId { get; set; }
        public int SourceQuestionId { get; set; }
        public QuestionConditionalType Condition { get; set; }
        public string Value { get; set; }
    }

}