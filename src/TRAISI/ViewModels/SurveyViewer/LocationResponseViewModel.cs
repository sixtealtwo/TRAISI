using System.Collections.Concurrent;
using System.Collections.Generic;
using TRAISI.Data.Models.ResponseTypes;
using Newtonsoft.Json.Linq;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class LocationResponseViewModel : SurveyResponseViewModel
    {
        public new List<LocationResponseValueViewModel> ResponseValues { get; set; }
    }

    public class LocationResponseValueViewModel
    {
        public string Address { get; set; }
        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}