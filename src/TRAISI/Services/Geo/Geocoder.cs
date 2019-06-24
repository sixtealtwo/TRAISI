using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Helpers.Interfaces;

namespace TRAISI.Services.Geo
{
    /// <summary>
    /// GeoServiceProvider for Geocoder.ca
    /// </summary>
    public class Geocoder : IGeoServiceProvider
    {
        public Task<Dictionary<string, string>> DistanceMatrix(List<string> origins, List<string> destinations)
        {
            throw new System.NotImplementedException();
        }

        public Task<string> ReverseGeocodeAsync(double latitude, double longitude)
        {
            throw new System.NotImplementedException();
        }
    }
}