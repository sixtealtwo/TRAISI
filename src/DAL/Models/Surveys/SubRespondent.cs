using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    /// <summary>
    /// Sub Respondent type, associated with another primary respondent
    /// </summary>
    public class SubRespondent : SurveyRespondent
    {


        public string Relationship { get; set; }

        public SubRespondent()
        {

        }
    }
}