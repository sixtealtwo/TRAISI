using System.Collections.Concurrent;
using System.Collections.Generic;
using TRAISI.Data.Models.ResponseTypes;
using Newtonsoft.Json.Linq;

namespace TRAISI.ViewModels.SurveyViewer
{
    public class LocationResponseViewModel
    {
        public List<Dictionary<string, object>> ResponseValues { get; set; }
    }
}