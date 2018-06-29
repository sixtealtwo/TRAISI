using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;

namespace DAL.Models.ResponseTypes
{
    public class JsonResponse : IResponseValue
    {

        public int Id { get; set; }

        [Column(TypeName = "jsonb")]
        JObject Value { get; set; }

        public SurveyResponse SurveyResponse { get; set; }
    }

}