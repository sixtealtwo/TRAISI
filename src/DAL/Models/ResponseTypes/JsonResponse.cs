using DAL.Models.Questions;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;

namespace DAL.Models.ResponseTypes {
    public class JsonResponse : SurveyResponse {
        JObject Value { get; set; }
    }

}