using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models.Surveys {
    public class QuestionConfiguration : IQuestionConfiguration {
        public int Id { get; set; }
        public string Key { get; set; }

        [Column (TypeName = "jsonb")]
        public string Value { get; set; }

    }
}