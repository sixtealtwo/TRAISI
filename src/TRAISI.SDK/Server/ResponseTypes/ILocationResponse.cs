using NetTopologySuite.Geometries;

namespace TRAISI.SDK.Library.ResponseTypes
{
    public interface ILocationResponse : IResponseType
    {
        Point Location {get;set;}

        string Address { get; set; }
    }
}