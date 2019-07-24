using System;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface IDateTimeResponse : IResponseType
    {
        DateTime Value { get; set; }
    }
}