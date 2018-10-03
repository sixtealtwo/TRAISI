using System;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface ITimelineResponse : IResponseType
    {
        string Purpose { get; set; }

        DateTime TimeA { get; set; }

        DateTime TimeB { get; set; }
    }
}