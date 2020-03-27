using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;
using DAL.Core;
using Newtonsoft.Json;

namespace DAL.Models.Questions
{
    /// <summary>
    /// Conditional data for a question
    /// </summary>
    public class QuestionConditional
    {
        [JsonIgnore]
        public int Id { get; set; }
        public QuestionPartView SourceQuestion { get; set; }

        [ForeignKey("SourceQuestion")]
        public int SourceQuestionId { get; set; }
        public QuestionConditionalType Condition { get; set; }
        public string Value { get; set; }
    }

}