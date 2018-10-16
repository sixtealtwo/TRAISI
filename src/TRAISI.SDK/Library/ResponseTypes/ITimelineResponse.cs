using System;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface ITimelineResponse : IResponseType
    {
        string Purpose { get; set; }

        string Name { get; set; }

        DateTime TimeA { get; set; }

        DateTime TimeB { get; set; }
    }
}