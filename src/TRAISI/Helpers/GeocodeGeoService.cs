using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RestSharp;
using TRAISI.Helpers.Interfaces;

namespace TRAISI.Helpers
{
    public class GeocodeGeoService : IGeoServiceProvider
    {

        private static readonly string GEOCODER_API_URL = "https://geocoder.ca/";
        private GeoConfig _config;

        private readonly RestClient _geocodeClient;

        // private static readonly string MAPBOX_MODE_DRIVING = "driving";
        // private static readonly string GOOGLE_MODE_WALKING = "walking";
        // private static readonly string GOOGLE_MODE_BICYCLING = "ciclying";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="config"></param>
        public GeocodeGeoService(IOptions<GeoConfig> config)
        {
            _config = config.Value;
            this._geocodeClient = new RestClient(GEOCODER_API_URL);
        }

        public async Task<Tuple<double, double>> GeocodeAsync(string address)
        {
            var request = new RestRequest(Method.GET);
            request.AddParameter("locate", address);
            request.AddParameter("json", 1);
            request.AddParameter("auth", "136696805604567884046x6474");

            var response = await this._geocodeClient.ExecuteTaskAsync(request);

            return null;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="origins"></param>
        /// <param name="destinations"></param>
        /// <returns></returns>
        Task<Dictionary<string, string>> IGeoServiceProvider.DistanceMatrix(List<string> origins, List<string> destinations)
        {
            throw new System.NotImplementedException();
        }

		/// <summary>
		/// 
		/// </summary>
		/// <param name="latitude"></param>
		/// <param name="longitude"></param>
		/// <returns></returns>
        public async Task<string> ReverseGeocodeAsync(double latitude, double longitude)
        {
            var request = new RestRequest(Method.GET);
            request.AddParameter("latt", latitude);
            request.AddParameter("longt", longitude);
            request.AddParameter("json", 1);
            request.AddParameter("reverse", 1);
            request.AddParameter("auth", "136696805604567884046x6474");
            var response = await this._geocodeClient.ExecuteTaskAsync(request);
            return response.Content;
        }

    }
}
