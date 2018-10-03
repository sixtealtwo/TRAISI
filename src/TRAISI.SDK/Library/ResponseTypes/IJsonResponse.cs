using Newtonsoft.Json.Linq;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface IJsonResponse : IResponseType
    {
         string Value { get; set; }
    }
}