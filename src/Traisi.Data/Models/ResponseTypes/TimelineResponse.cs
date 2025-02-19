using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json.Linq;
using Traisi.Data.Models.Questions;
using Traisi.Data.Models.Surveys;
using Traisi.Sdk.Library.ResponseTypes;
namespace Traisi.Data.Models.ResponseTypes
{
    /// <summary>
    /// 
    /// </summary>
    public class TimelineResponse : LocationResponse, ITimelineResponse
    {

        public string Purpose { get; set; }

        public string Name { get; set; }

        public DateTimeOffset TimeA { get; set; }

        public DateTimeOffset TimeB { get; set; }

        public int? Order { get; set; }

        public string Mode { get; set; }

        public string Identifier {get;set;}

        [Column(TypeName = "jsonb")]
        public string Meta {get;set;}
    }

    public class TimelineTmpResponse : LocationLatLngResponse
    {
        public string Purpose { get; set; }

        public string Name { get; set; }

        public DateTimeOffset TimeA { get; set; }

        public DateTimeOffset TimeB { get; set; }

        public int? Order { get; set; }

        public string Mode { get; set; }

        public string Identifier {get;set;}

        public JObject Meta {get;set;}
    }

}