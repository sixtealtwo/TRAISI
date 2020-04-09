using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using NetTopologySuite.Geometries;
using TRAISI.SDK.Library.ResponseTypes;
using System.ComponentModel.DataAnnotations.Schema;

namespace TRAISI.Data.Models.ResponseTypes
{
    public class LocationResponse : ResponseValue, ILocationResponse
    {
        [Column(TypeName="geography")]
        public Point Location {get;set;}

        public string Address { get; set; }
    }
}