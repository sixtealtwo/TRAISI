using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Primary Respondent type for surveys.
    /// </summary>
    public class PrimaryRespondent : ISurveyRespondent
    {
        public int Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public ISurveyRespondentGroup SurveyRespondentGroup { get; set; }

        public ICollection<ISurveyResponse> SurveyResponses { get; set; }

				public Shortcode Shortcode { get; set; }

        public PrimaryRespondent()
        {
        }
    }
}