using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Primary Respondent type for surveys.
    /// </summary>
    public class PrimaryRespondent : SurveyRespondent
    {

        public Shortcode Shortcode { get; set; }

        public GroupCode Groupcode { get; set; }

        public ApplicationUser User { get; set; }

        public List<SurveyAccessRecord> SurveyAccessRecords { get; set; }

        public Survey Survey { get; set; }

        public PrimaryRespondent()
        {

            this.SurveyAccessRecords = new List<SurveyAccessRecord>();
        }
    }
}