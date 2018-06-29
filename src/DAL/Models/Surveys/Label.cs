using System;
using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class Label : IAuditableEntity
    {
        public int Id { get; set; }

        public Survey survey;

        public string Text { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}