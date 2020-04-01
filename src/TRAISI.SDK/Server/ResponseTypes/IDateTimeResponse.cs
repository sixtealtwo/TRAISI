using System;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface IDateTimeResponse : IResponseType
    {
        DateTimeOffset Value { get; set; }
    }
}