using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Geocoding;
using Geocoding.Google;
using Microsoft.Extensions.Options;
using RestSharp;

namespace TRAISI.Helpers
{
	public interface IGeoService
	{
		Task<string> ReverseGeocodeAsync(double latitude, double longitude);

		Task<string> DistanceMatrix(List<string> origins, List<string> destinations);
	}

	public class GeoService : IGeoService
	{

		private static readonly string GOOGLE_API_URL = "https://maps.googleapis.com/maps/api";

		private static readonly string GOOGLE_MODE_DRIVING = "driving";
		private static readonly string GOOGLE_MODE_TRANSIT = "transit";
		private static readonly string GOOGLE_MODE_WALKING = "walking";

		private static readonly string GOOGLE_MODE_BICYCLING = "bicycling ";

		private readonly IGeocoder _geocoder;
		private GeoConfig _config;
		private readonly RestClient _googleApiClient;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="config"></param>
		public GeoService(IOptions<GeoConfig> config)
		{
			_config = config.Value;
			this._geocoder = new GoogleGeocoder() { ApiKey = _config.APIKey };
			this._googleApiClient = new RestClient(GOOGLE_API_URL);
		}

		public async Task<string> ReverseGeocodeAsync(double latitude, double longitude)
		{
			var result = await this._geocoder.ReverseGeocodeAsync(latitude, longitude);
			return result.First().FormattedAddress;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="origins"></param>
		/// <param name="destinations"></param>
		/// <returns></returns>
		public Task<string> DistanceMatrix(List<string> origins, List<string> destinations)
		{
			var request = new RestRequest("distancematrix/json", Method.GET);
			request.AddParameter("origins", String.Join("|", origins.ToArray()));
			request.AddParameter("destinations", String.Join("|", destinations.ToArray()));
			request.AddParameter("key", _config.APIKey);
			request.AddParameter("mode", GOOGLE_MODE_BICYCLING);
			request.AddParameter("mode", GOOGLE_MODE_DRIVING);
			request.AddParameter("mode", GOOGLE_MODE_WALKING);
			request.AddParameter("mode", GOOGLE_MODE_TRANSIT);

			var apiTask = new TaskCompletionSource<string>();
			_googleApiClient.ExecuteAsync(request, response =>
			{
				Console.WriteLine(response.Content);
				apiTask.SetResult(response.Content);
			});
			return apiTask.Task;

		}
	}

	public class GeoConfig
	{
		public string Provider { get; set; }
		public string APIKey { get; set; }
	}
}