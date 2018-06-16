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
    [Authorize]
    [Route("api/[controller]")]
    public class MapServiceController : Controller
    {
        private IGeocoder _geocoder;

        public MapServiceController()
        {
            this._geocoder = new GoogleGeocoder() { ApiKey = "AIzaSyAy4ehUhieFvo1SfRzQ - pLB6TpWqCzbIrY" };
        }

        // GET: api/<controller>
        [HttpGet]
        [Route("reversegeo/{lat}/{lng}")]
				[Produces(typeof(string))]
        public async Task<IActionResult> ReverseGeocode(double lat, double lng)
        {
            var result = await _geocoder.ReverseGeocodeAsync(lat, lng);
            return Ok(result.First().FormattedAddress);
        }
        
    }
}
