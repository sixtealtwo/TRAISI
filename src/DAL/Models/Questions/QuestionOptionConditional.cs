using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;
using DAL.Core;

namespace DAL.Models.Questions
{
    /// <summary>
    /// Conditional data for a question
    /// </summary>
    public class QuestionOptionConditional
    {
        public int Id { get; set; }
        public QuestionOption TargetOption { get; set; }

        [ForeignKey("TargetOption")]
        public int TargetOptionId { get; set; }
        
        public QuestionPart SourceQuestion { get; set; }

        [ForeignKey("SourceQuestion")]
        public int SourceQuestionId { get; set; }

        public QuestionConditionalType Condition { get; set; }
        public string Value { get; set; }

    }

}