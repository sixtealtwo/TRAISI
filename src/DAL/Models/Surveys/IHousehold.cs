using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public interface IHousehold
    {

        int Id { get; set; }

        ICollection<ISurveyRespondent> HouseholdMembers { get; set; }
    }
}