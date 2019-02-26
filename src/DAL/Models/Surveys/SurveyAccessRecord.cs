using System;
using DAL.Models.Interfaces;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Label items, store most alterable and dynamic text fields.
    /// </summary>
    public class SurveyAccessRecord : AuditableEntity, ISurveyAccessRecord
    {

        public int Id { get; set; }
        public string QueryString { get; set; }
        public DateTime AccessDateTime { get; set; }

        public string UserAgent { get; set; }

    }
}