using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Configuration Data for question parts
    /// </summary>
    public class QuestionConfiguration : IQuestionConfiguration
    {
        public int Id { get; set; }

        /// <summary>
        /// Object representation of all configuration options beloning to this specific
        /// coniguration.
        /// </summary>
        /// <returns></returns>
        [Column(TypeName = "jsonb")]
        public string Value { get; set; }

        public QuestionPart QuestionPart { get; set; }


    }
}