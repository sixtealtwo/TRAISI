using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public class NumberResponse : ResponseValue, INumberResponse
    {
   
        public double Value { get; set; }


    }
}