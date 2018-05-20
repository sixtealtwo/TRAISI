using DAL.Models.ResponseTypes;

namespace DAL.Models.Surveys
{
    public class SurveyResponse<T>
    {
        public int Id { get; set; }

        IResponseType<T> Value{get;set;}


    }
}