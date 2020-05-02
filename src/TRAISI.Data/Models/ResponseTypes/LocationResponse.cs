using Traisi.Data.Models.Questions;
using Traisi.Data.Models.Surveys;
using NetTopologySuite.Geometries;
using Traisi.Sdk.Library.ResponseTypes;
using System.ComponentModel.DataAnnotations.Schema;

namespace Traisi.Data.Models.ResponseTypes
{
    public class LocationResponse : ResponseValue, ILocationResponse
    {
        [Column(TypeName="geography")]
        public Point Location {get;set;}

        public string Address { get; set; }
    }
}