using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using DAL.Core;

namespace DAL.Models.Questions {

    /// <summary>
    /// A conditional operator that joins a chain of conditionals.
    /// </summary>
    public class QuestionConditionalOperator {
        public int Id { get; set; }

        /// <summary>
        /// The order of the operator in the conditional group
        /// </summary>
        /// <value></value>
        public int Order { get; set; }

        public QuestionCondtionalOperatorType OperatorType { get; set; }

        public QuestionConditional Lhs { get; set; }

        public QuestionConditional Rhs { get; set; }

        public QuestionPartView TargetQuestion {get;set;}

        [ForeignKey("TargetQuestion")]
        public int TargetQuestionId {get;set;}

    }

    /// <summary>
    /// Conditional operator type
    /// </summary>
    public enum QuestionCondtionalOperatorType {
        [EnumMember(Value = "AND")]
        AND,
        [EnumMember(Value = "OR")]
        OR
    }
}