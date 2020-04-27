using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using TRAISI.Data.Models.Interfaces;
using TRAISI.Data.Models.Questions;

namespace TRAISI.Data.Models.Surveys {
	/// <summary>
	/// Label items, store most alterable and dynamic text fields.
	/// </summary>
	public class SurveyLogic {

        [JsonIgnore]
        public int Id {get;set;} 

        public SurveyLogicCondition Condition {get;set;}

        public SurveyLogic SubSurveyLogic {get;set;}

        public List<SurveyLogicExpression> Expressions {get;set;}
    }

    public class SurveyLogicExpression {
        
        [JsonIgnore]
        public int Id {get;set;}
        public string Value {get;set;}
        public QuestionPartView Question { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public SurveyLogicOperator Operator {get;set;}
    }

    public enum SurveyLogicOperator {

    }

    public enum SurveyLogicCondition {
        [EnumMember(Value = "AND")]
        AND,
        [EnumMember(Value = "OR")]
        OR
    }
}