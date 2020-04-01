using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using NetTopologySuite.Geometries;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
    public class LocationResponse : ResponseValue, ILocationResponse
    {
        public Point Location {get;set;}

        public string Address { get; set; }



    }
}