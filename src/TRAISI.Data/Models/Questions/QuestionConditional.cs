using System.ComponentModel.DataAnnotations.Schema;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Core;
using Newtonsoft.Json;

namespace TRAISI.Data.Models.Questions
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