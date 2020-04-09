using System;
using TRAISI.Data.Models.Interfaces;

namespace TRAISI.Data.Models.Surveys
{
    public interface ISurveyAccessRecord
    {
        int Id { get; set; }
        string QueryParams { get; set; }

        DateTimeOffset AccessDateTime { get; set; }
        string UserAgent { get; set; }

        ApplicationUser AccessUser { get; set; }
    }
}