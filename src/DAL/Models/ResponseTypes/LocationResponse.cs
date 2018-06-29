using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public class LocationResponse : IResponseValue
    {

        public int Id { get; set; }
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Address { get; set; }

        public SurveyResponse SurveyResponse { get; set; }



    }
}