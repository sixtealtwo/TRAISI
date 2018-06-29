using DAL.Models.Questions;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Stores a single configuration value that belongs to a question configuration
    /// </summary>
    public interface IQuestionConfiguration
    {

        int Id { get; set; }

        /// <summary>
        /// Raw data of this configuration
        /// </summary>
        /// <returns></returns>
        string Value { get; set; }

        IQuestionPart QuestionPart { get; set; }
    }
}