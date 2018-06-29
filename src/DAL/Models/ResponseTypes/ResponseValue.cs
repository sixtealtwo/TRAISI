using System.ComponentModel.DataAnnotations;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public abstract class ResponseValue
    {
        public int Id { get; set; }
        public SurveyResponse SurveyResponse { get; set; }



    }
}