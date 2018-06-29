using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public class StringResponse : IResponseValue
    {
        public int Id { get; set; }

        public string Value { get; set; }

        public SurveyResponse SurveyResponse { get; set; }


    }
}