using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Traisi.Data.Models.Extensions;
using Traisi.Data.Models.Interfaces;
using Traisi.Data.Models.Questions;

namespace Traisi.Data.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class SurveyLogic
    {
        [JsonIgnore]
        public int Id { get; set; }
        public SurveyLogicCondition? Condition { get; set; }
        public List<SurveyLogic> Expressions { get; set; }
        public LabelCollection<Label> ValidationMessages { get; set; }
        public string Value { get; set; }
        public QuestionPartView Question { get; set; }

        [ForeignKey("Question")]
        public int? QuestionId { get; set; }
        public SurveyLogicOperator? Operator { get; set; }
    }

    public enum SurveyLogicOperator
    {
        [EnumMember(Value = "Equals")]
        Equals,
        [EnumMember(Value = "NotEquals")]
        NotEquals,
        [EnumMember(Value = "GreaterThan")]
        GreaterThan
    }

    public enum SurveyLogicCondition
    {
        [EnumMember(Value = "and")]
        And,
        [EnumMember(Value = "or")]
        Or
    }
}