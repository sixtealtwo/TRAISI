using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public class SurveyRespondentGroup : ISurveyRespondentGroup
    {
        public int Id { get; set; }

        public List<SurveyRespondent> GroupMembers { get; set; }

        public PrimaryRespondent GroupPrimaryRespondent { get; set; }

        public SurveyRespondentGroup()
        {
            //this.GroupMembers = new HashSet<SurveyRespondent>();
            this.GroupMembers = new List<SurveyRespondent>();
        }
    }
}