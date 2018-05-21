using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes {
    public class IntegerResponse : SurveyResponse {

        public int Value { get; set; }
    }
}