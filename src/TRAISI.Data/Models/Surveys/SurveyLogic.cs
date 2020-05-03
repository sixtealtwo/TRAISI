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

        public SurveyLogic()
        {
            ValidationMessages = new LabelCollection<Label>();
            Expressions = new List<SurveyLogic>();
        }
    }

    public enum SurveyLogicOperator
    {
        [EnumMember(Value = "=")]
        Equals,
        [EnumMember(Value = "!=")]
        NotEquals,
        [EnumMember(Value = ">")]
        GreaterThan,
        [EnumMember(Value = ">=")]
        GreaterThanEqualTo,
        [EnumMember(Value = "<")]
        LessThan,
        [EnumMember(Value = "<=")]
        LessThanEqualTo,
        [EnumMember(Value = "contains")]
        Contains,
        [EnumMember(Value = "like")]
        Like,
        [EnumMember(Value = "any of")]
        AnyOf,
        [EnumMember(Value = "all of")]
        AllOf,
        [EnumMember(Value = "none of")]
        NoneOf
    }

    public enum SurveyLogicCondition
    {
        [EnumMember(Value = "and")]
        And,
        [EnumMember(Value = "or")]
        Or
    }
}