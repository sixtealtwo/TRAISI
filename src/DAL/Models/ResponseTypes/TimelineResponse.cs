using System;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    /// <summary>
    /// 
    /// </summary>
    public class TimelineResponse : LocationResponse, ITimelineResponse
    {

        public string Purpose { get; set; }

        public string Name { get; set; }

        public DateTime TimeA { get; set; }

        public DateTime TimeB { get; set; }
    }
}