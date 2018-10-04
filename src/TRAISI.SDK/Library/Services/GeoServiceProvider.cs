using System.Threading.Tasks;

namespace TRAISI.SDK.Library.Services
{
    public abstract class GeoServiceProvider
    {
        public abstract Task<string> ReverseGeocodeAsync(double latitude, double longitude);

        public abstract Task<object> CalculateDistanceAndDurationAsync(object origin, object destination);
    }
}