using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public interface IResponseValue
    {
        int Id { get; set; }

        SurveyResponse SurveyResponse { get; set; }



    }
}