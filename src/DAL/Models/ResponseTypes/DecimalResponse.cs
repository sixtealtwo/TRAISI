using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public class DecimalResponse : IResponseValue
    {

        public int Id { get; set; }

        public double Value { get; set; }

        public SurveyResponse SurveyResponse { get; set; }
    }
}