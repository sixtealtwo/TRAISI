using System.Collections.Concurrent;
using System.Collections.Generic;
using TRAISI.Data.Models.ResponseTypes;
using Newtonsoft.Json.Linq;
using System;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class TimelineResponseViewModel : SurveyResponseViewModel
    {
        public new List<TimelineResponseValueViewModel> ResponseValues { get; set; }

    }

    public class TimelineResponseValueViewModel
    {
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTimeOffset TimeA { get; set; }
        public DateTimeOffset TimeB { get; set; }
        public string Name { get; set; }
        public string Purpose { get; set; }
        public int Order { get; set; }
    }
}