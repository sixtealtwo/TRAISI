using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Core;

namespace DAL.Models.Questions
{

    /// <summary>
    /// A conditional operator that joins a chain of conditionals.
    /// </summary>
    public class QuestionConditionalGroup
    {

        public int Id { get; set; }

        public List<QuestionConditionalOperator> Conditionals { get; set; }

        public QuestionConditionalGroup()
        {
            Conditionals = new List<QuestionConditionalOperator>();
        }

        /// <summary>
        /// The target of the group of conditionals, can be section or question
        /// </summary>
        /// <value></value>
        public QuestionPartView TargetQuestion { get; set; }

    }
}