using System;
using System.Text.Json.Serialization;
using TRAISI.Data.Models.Interfaces;

namespace TRAISI.Data.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class SurveyLogicLabel : Label
    {
        [JsonIgnore]
        public int Id {get;set;}

    }
}