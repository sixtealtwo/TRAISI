using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public class IntegerResponse : ResponseValue, IIntegerResponse
    {
   
        public int Value { get; set; }


    }
}