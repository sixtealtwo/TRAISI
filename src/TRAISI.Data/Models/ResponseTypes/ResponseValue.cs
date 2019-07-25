using System.ComponentModel.DataAnnotations;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public abstract class ResponseValue: IResponseType
    {
        [Key]
        public int Id { get; set; }
        public SurveyResponse SurveyResponse { get; set; }



    }
}