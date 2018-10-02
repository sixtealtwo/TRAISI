using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Extensions;
using DAL.Models.Questions;
using TRAISI.SDK.Enums;

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

        /// <summary>
        /// Serialized representation of some form of data.
        /// </summary>
        /// <value></value>
        public string Value { get; set; }

        /// <summary>
        /// Resource only configurations should tell the builder they are not alterable - just for display purposes.
        /// </summary>
        /// <value></value>
        public bool IsResourceOnly {get;set;}

        /// <summary>
        /// Holds discriminator information to identity the type of data that is serialized in the Value field.
        /// </summary>
        /// <value></value>
        public QuestionConfigurationValueType ValueType { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public LabelCollection<QuestionConfigurationLabel> QuestionConfigurationLabels { get; set; }

    }

}