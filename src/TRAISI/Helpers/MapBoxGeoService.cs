using System.Collections.Generic;
using System.Threading.Tasks;
using TRAISI.Helpers.Interfaces;

namespace TRAISI.Helpers
{
	public class MapBoxGeoService : IGeoServiceProvider
	{

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
