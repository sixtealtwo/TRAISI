using System.Collections.Generic;
using System.Threading.Tasks;

namespace TRAISI.Helpers.Interfaces
{
    public interface IGeoServiceProvider
    {

		
		/// <summary>
		/// 
		/// </summary>
		/// <param name="latitude"></param>
		/// <param name="longitude"></param>
		/// <returns></returns>
		Task<string> ReverseGeocodeAsync(double latitude, double longitude);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="origins"></param>
		/// <param name="destinations"></param>
		/// <returns></returns>
		Task<Dictionary<string, string>> DistanceMatrix(List<string> origins, List<string> destinations);
    }
}