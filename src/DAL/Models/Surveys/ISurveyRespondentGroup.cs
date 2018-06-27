using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public interface ISurveyRespondentGroup
    {

        int Id { get; set; }

        ICollection<ISurveyRespondent> HouseholdMembers { get; set; }
    }
}