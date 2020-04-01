using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public class DecimalResponse : ResponseValue, IDecimalResponse
    {
        public double Value { get; set; }

    }
}