using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;

namespace DAL.Models.Questions
{
    /// <summary>
    /// Configuration Data for question parts
    /// </summary>
    public abstract class QuestionConfiguration : IQuestionConfiguration
    {
        public int Id { get; set; }


        public string PropertyName { get; set; }

        public ConfiguratonType ConfiguratonType {get;set;}


    }

    public enum ConfiguratonType {
        SETTING,
        CONFIGURATION
    }
}