using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Geocoding;
using Geocoding.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using RestSharp;
using Traisi.Helpers;
using Traisi.Helpers.Interfaces;
using Traisi.Sdk.GeoServices;
using Traisi.ViewModels;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Traisi.Controllers
{
    // [Authorize]
    [Route("api/[controller]")]
    public class GeoServiceController : Controller
    {
        private readonly IGeoServiceProvider _geoService;
        private readonly RestClient _triplinx;
        private readonly IConfiguration _configuration;
        private readonly string TRIPLINX_API_KEY;

        public GeoServiceController(IGeoServiceProvider geoService, IConfiguration configuration)
        {
            this._geoService = geoService;
            this._triplinx = new RestClient("https://api.triplinx.cityway.ca/api/journeyplanner/opt");
            this._configuration = configuration;

        }

        // GET: api/<controller>
        [HttpGet]
        [Route("reversegeo/{lat}/{lng}")]
        [Produces(typeof(IGeocodeResult))]
        public async Task<IActionResult> ReverseGeocode(double lat, double lng)
        {
            var address = await this._geoService.ReverseGeocodeAsync(lat, lng);
            GeocodeResult result = new GeocodeResult() { Latitude = lat, Longitude = lng, Address = address };
            return Ok(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="origins"></param>
        /// <param name="destiations"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("distancematrix")]
        public async Task<IActionResult> DistanceMatrix([FromQuery] List<string> origins, [FromQuery] List<string> destinations)
        {

            var result = await this._geoService.DistanceMatrix(origins, destinations);
            return new OkObjectResult(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="arrival"></param>
        /// <param name="departure"></param>
        /// <param name="date"></param>
        /// <param name="mode"></param>
        /// <param name="accessibiliy"></param>
        /// <param name="transitModes"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("routeplanner")]
        [ProducesResponseType(typeof(JObject), StatusCodes.Status200OK)]
        public async Task<IActionResult> RoutePlanner([FromQuery] double arrivalLat,
        [FromQuery] double arrivalLng, [FromQuery] double departureLat, [FromQuery] double departureLng,
         [FromQuery] DateTime date,
        [FromQuery] string mode, [FromQuery] bool IsBackTrip, [FromQuery] string transitModes = "", [FromQuery] string accessibiliy = "",
        [FromQuery] int maxCarDistance = 0,
        [FromQuery] int maxBikeDistance = 0)
        {


            var request = new RestRequest("PlanTrips/json", Method.GET);
            request.AddParameter("user_key", "e447b4a0ad00018a370c7ab0760e3cfd");
            request.AddParameter("DepartureLatitude", departureLat);
            request.AddParameter("DepartureLongitude", departureLng);
            request.AddParameter("DepartureType", "COORDINATES");
            request.AddParameter("ArrivalType", "COORDINATES");
            request.AddParameter("ArrivalLatitude", arrivalLat);
            request.AddParameter("ArrivalLongitude", arrivalLng);
            request.AddParameter("TripModes", mode);
            request.AddParameter("IsBackTrip", IsBackTrip ? 1 : 0);
            request.AddParameter("Date", date.ToString("yyyy-MM-dd_HH-mm"));
            request.AddParameter("MaxCarDistance", maxCarDistance);
            request.AddParameter("maxBikeDistance", maxBikeDistance);

            if (!string.IsNullOrEmpty(transitModes) && transitModes.Trim().Length > 0)
            {
                // request.AddParameter("Modes", transitModes.Trim());
            }

            // request.AddParameter("Accessibility", accessibiliy);
            request.AddParameter("DateType", "DEPARTURE");
            request.AddParameter("Algorithm", "FASTEST");

            var response = await _triplinx.ExecuteAsync(request);


            return new OkObjectResult(JObject.Parse(response.Content));
        }

    }
}