
namespace Traisi.Sdk.GeoServices
{

    public class GeocodeResult : IGeocodeResult
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
    }
}