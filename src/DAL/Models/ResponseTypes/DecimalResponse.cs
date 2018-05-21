using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes {
    public class DecimalResponse : SurveyResponse {

        public double Value { get; set; }
    }
}