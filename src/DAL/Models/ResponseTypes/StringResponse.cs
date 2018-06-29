using System.ComponentModel.DataAnnotations;
using DAL.Models.Questions;
using DAL.Models.Surveys;

namespace DAL.Models.ResponseTypes
{
    public class StringResponse : ResponseValue
    {

        public string Value { get; set; }



    }
}