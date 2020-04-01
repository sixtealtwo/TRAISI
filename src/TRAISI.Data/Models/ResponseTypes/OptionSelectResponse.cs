using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public class OptionSelectResponse : ResponseValue, IOptionSelectResponse
    {

        public string Value { get; set; }
        public string Code { get; set; }
    }
}