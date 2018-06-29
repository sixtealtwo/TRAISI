using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public class SurveyRespondentGroup : ISurveyRespondentGroup
    {
        public int Id { get; set; }

        public ICollection<ISurveyRespondent> GroupMembers { get; set; }

        public SurveyRespondentGroup()
        {
            this.GroupMembers = new HashSet<ISurveyRespondent>();
        }
    }
}