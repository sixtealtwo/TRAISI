using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public class LocationResponse : ResponseValue, ILocationResponse
    {
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Address { get; set; }



    }
}