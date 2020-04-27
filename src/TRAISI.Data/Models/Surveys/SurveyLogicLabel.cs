using System;
using TRAISI.Data.Models.Interfaces;

namespace TRAISI.Data.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class SurveyLogicLabel : ILabel
    {

        public int Id {get;set;}
        public string Value { get; set; }

        public string Language { get; set; }


    }
}