using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public class IntegerResponse : IResponseValue
    {

        public int Id { get; set; }
        public int Value { get; set; }

        public SurveyResponse SurveyResponse { get; set; }
    }
}