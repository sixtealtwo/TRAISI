using System.ComponentModel.DataAnnotations;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public class StringResponse : ResponseValue, IStringResponse
    {

        public string Value { get; set; }





    }
}