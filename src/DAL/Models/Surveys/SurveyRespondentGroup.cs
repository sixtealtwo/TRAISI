using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public class SurveyRespondentGroup : ISurveyRespondentGroup
    {
        public int Id { get; set; }

        //public ICollection<SurveyRespondent> GroupMembers { get; set; }

        public SurveyRespondentGroup()
        {
            //this.GroupMembers = new HashSet<SurveyRespondent>();
        }
    }
}