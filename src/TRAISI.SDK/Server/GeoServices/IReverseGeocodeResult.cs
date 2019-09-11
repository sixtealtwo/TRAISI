

namespace TRAISI.SDK.GeoServices
{

    public interface IGeocodeResult
    {

        double Latitude { get; set; }

        double Longitude { get; set; }

        string Address { get; set; }
    }
}