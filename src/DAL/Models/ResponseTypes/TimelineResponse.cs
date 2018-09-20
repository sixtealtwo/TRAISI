using System;
using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    /// <summary>
    /// 
    /// </summary>
    public class TimelineResponse : LocationResponse
    {
        public DateTime Time {get;set;}

        public string Purpose {get;set;}
    }
}