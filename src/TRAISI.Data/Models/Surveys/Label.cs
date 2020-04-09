using System;
using TRAISI.Data.Models.Interfaces;

namespace TRAISI.Data.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class Label : AuditableEntity, ILabel
    {

        public string Value { get; set; }

        public string Language { get; set; }


    }
}