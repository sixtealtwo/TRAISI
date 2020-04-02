using System.Collections.Concurrent;
using System.Collections.Generic;
using TRAISI.Data.Models.ResponseTypes;
using Newtonsoft.Json.Linq;
using System;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class TimelineResponseViewModel
    {
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Address { get; set; }

        public string Purpose { get; set; }

        public string Name { get; set; }

        public DateTimeOffset TimeA { get; set; }

        public DateTimeOffset TimeB { get; set; }

        public int? Order { get; set; }
    }
}