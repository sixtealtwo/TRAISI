using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TRAISI.Helpers;
using TRAISI.ViewModels;
using Geocoding;
using Geocoding.Google;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TRAISI.Controllers
{
    // [Authorize]
    [Route("api/[controller]")] 
    public class MapServiceController : Controller
    {
        private readonly IGeoService _geoService;
        public MapServiceController(IGeoService geoService)
        {
            this._geoService = geoService;

        }

        // GET: api/<controller>
        [HttpGet]
        [Route("reversegeo/{lat}/{lng}")]
        [Produces(typeof(GeoLocationViewModel))]
        public async Task<IActionResult> ReverseGeocode(double lat, double lng)
        {
            var address = await this._geoService.ReverseGeocodeAsync(lat, lng);
            GeoLocationViewModel result = new GeoLocationViewModel() { Latitude = lat, Longitude = lng, Address = address };
            return Ok(result);
        }

    }
}
