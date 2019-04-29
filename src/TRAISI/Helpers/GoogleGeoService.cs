using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Geocoding;
using Geocoding.Google;
using Microsoft.Extensions.Options;
using RestSharp;
using TRAISI.Helpers.Interfaces;

namespace TRAISI.Helpers {

	public class GoogleGeoService : IGeoServiceProvider {

		private static readonly string GOOGLE_API_URL = "https://maps.googleapis.com/maps/api";
		private static readonly string GOOGLE_MODE_DRIVING = "driving";
		private static readonly string GOOGLE_MODE_TRANSIT = "transit";
		private static readonly string GOOGLE_MODE_WALKING = "walking";
		private static readonly string GOOGLE_MODE_BICYCLING = "bicycling";

		private static readonly string[] GOOGLE_MODES = new string[] {
			GOOGLE_MODE_DRIVING,
			GOOGLE_MODE_TRANSIT,
			GOOGLE_MODE_WALKING,
			GOOGLE_MODE_BICYCLING
		};

		private readonly IGeocoder _geocoder;
		private GeoConfig _config;
		private readonly RestClient _googleApiClient;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="config"></param>
		public GoogleGeoService (IOptions<GeoConfig> config) {
			_config = config.Value;
			this._geocoder = new GoogleGeocoder () { ApiKey = _config.APIKey };
			this._googleApiClient = new RestClient (GOOGLE_API_URL);
		}

		public async Task<string> ReverseGeocodeAsync (double latitude, double longitude) {
			var result = await this._geocoder.ReverseGeocodeAsync (latitude, longitude);
			return result.First ().FormattedAddress;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="origins"></param>
		/// <param name="destinations"></param>
		/// <returns></returns>
		public Task<Dictionary<string,string>> DistanceMatrix (List<string> origins, List<string> destinations) {
			List<TaskCompletionSource<string>> apiTasks = new List<TaskCompletionSource<string>> ();
			Dictionary<string,string> apiResults = new Dictionary<string,string> ();
			var resultTask = new TaskCompletionSource<Dictionary<string,string>> ();
			foreach (var mode in GOOGLE_MODES) {
				var request = new RestRequest ("distancematrix/json", Method.GET);
				request.AddParameter ("origins", String.Join ("|", origins.ToArray ()));
				request.AddParameter ("destinations", String.Join ("|", destinations.ToArray ()));
				request.AddParameter ("key", _config.APIKey);
				request.AddParameter ("mode", mode);
				var apiTask = new TaskCompletionSource<string> ();
				apiTasks.Add (apiTask);
				_googleApiClient.ExecuteAsync (request, response => {
					Console.WriteLine (response.Content);
					apiResults.Add(mode,response.Content);
					apiTasks.Remove (apiTask);
					if (apiTasks.Count == 0) {
						resultTask.SetResult (apiResults);
					}
				});
			}

			return resultTask.Task;

		}

		Task<string> IGeoServiceProvider.ReverseGeocodeAsync(double latitude, double longitude)
		{
			throw new NotImplementedException();
		}

	}

	public class GeoConfig {
		public string Provider { get; set; }
		public string APIKey { get; set; }
	}
}