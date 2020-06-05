using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Traisi.Helpers.Interfaces;

namespace Traisi.Services.Geo
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

        public Task<Tuple<double, double>> GeocodeAsync(string address)
        {
            throw new NotImplementedException();
        }

        public Task<string> ReverseGeocodeAsync(double latitude, double longitude)
        {
            throw new System.NotImplementedException();
        }
    }
}