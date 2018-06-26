using System.Collections.Generic;

namespace DAL.Models.Surveys
{
    public class Household : IHousehold
    {
        public int Id { get;set; }

        public ICollection<ISurveyRespondent> HouseholdMembers{get;set;}
    }
}