namespace DAL.Models.Surveys
{
    public interface ISurveyRespondent
    {
        int Id { get; set; }

        IHousehold Household { get; set; }


    }
}