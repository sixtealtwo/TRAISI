using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;

namespace DAL.Models.Questions
{
    /// <summary>
    /// Configuration Data for question parts
    /// </summary>
    public class QuestionConfiguration : IQuestionConfiguration
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Value { get; set; }

    }

}