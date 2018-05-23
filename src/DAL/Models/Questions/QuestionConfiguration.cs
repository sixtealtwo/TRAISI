using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models.Surveys {
    public class QuestionConfiguration : IQuestionConfiguration {
        public int Id { get; set; }

        /// <summary>
        /// Object representation of all configuration options beloning to this specific
        /// coniguration.
        /// </summary>
        /// <returns></returns>
        [Column (TypeName = "jsonb")]
        public string Value { get; set; }

    }
}