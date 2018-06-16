using Geocoding;
using Geocoding.Google;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace TRAISI.Helpers
{
	public interface IGeoService 
	{
        Task<string> ReverseGeocodeAsync(double latitude, double longitude);
	}

    public class GeoService: IGeoService
    {
        private IGeocoder _geocoder;
        private GeoConfig _config;
        public GeoService(IOptions<GeoConfig> config)
        {
            _config = config.Value;
            this._geocoder = new GoogleGeocoder() { ApiKey = _config.APIKey };
        }

        public async Task<string> ReverseGeocodeAsync(double latitude, double longitude)
        {
            var result = await this._geocoder.ReverseGeocodeAsync(latitude, longitude);
            return result.First().FormattedAddress;
        }
    }

    public class GeoConfig
    {
        public string Provider { get; set; }
        public string APIKey { get; set; }
    }
}