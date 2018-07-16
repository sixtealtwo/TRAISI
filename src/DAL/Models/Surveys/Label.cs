using System;
using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class Label : AuditableEntity, ILabel
    {
        public int Id { get; set; }

        public string Value { get; set; }

        public string Language { get; set; }
    }
}