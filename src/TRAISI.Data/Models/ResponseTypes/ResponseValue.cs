using System.ComponentModel.DataAnnotations;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public abstract class ResponseValue: IResponseType
    {
        [Key]
        public int Id { get; set; }
        public SurveyResponse SurveyResponse { get; set; }



    }
}