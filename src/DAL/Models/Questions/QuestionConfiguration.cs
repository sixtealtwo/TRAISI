using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Extensions;
using DAL.Models.Questions;

namespace DAL.Models.Questions
{
    /// <summary>
    /// Configuration Data for question parts
    /// </summary>
    public class QuestionConfiguration : IQuestionConfiguration
    {
        public int Id { get; set; }

        /// <summary>
        /// The name or "key" of this configuration - it should be object and javascript friendly -- ie no spaces
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        public string Value { get; set; }

        public LabelCollection<QuestionConfigurationLabel> QuestionConfigurationLabels { get; set; }

    }

}