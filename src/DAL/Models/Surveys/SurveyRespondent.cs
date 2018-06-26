namespace DAL.Models.Surveys
{
    public class SurveyRespondent : ISurveyRespondent
    {
        public int Id { get;set; }
        public IHousehold Household { get;set; }
    }
}