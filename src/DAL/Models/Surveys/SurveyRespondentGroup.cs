using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public class SurveyRespondentGroup : ISurveyRespondentGroup
    {
        public int Id { get; set; }

        public ICollection<ISurveyRespondent> HouseholdMembers { get; set; }
    }
}