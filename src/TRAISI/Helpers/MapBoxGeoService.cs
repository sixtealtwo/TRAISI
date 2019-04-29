using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RestSharp;
using TRAISI.Helpers.Interfaces;

namespace TRAISI.Helpers
{
	public class MapBoxGeoService : IGeoServiceProvider
	{

		private static readonly string MAPBOX_DISTANCE_MATRIX_API = "https://api.mapbox.com/directions-matrix/v1/mapbox/";
		private GeoConfig _config;
		private RestClient _mapboxApiClient;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="config"></param>
		public MapBoxGeoService(IOptions<GeoConfig> config)
		{
			_config = config.Value;
			this._mapboxApiClient = new RestClient(MAPBOX_DISTANCE_MATRIX_API);
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
		Task<string> IGeoServiceProvider.ReverseGeocodeAsync(double latitude, double longitude)
		{
			throw new System.NotImplementedException();
		}


	}
}
