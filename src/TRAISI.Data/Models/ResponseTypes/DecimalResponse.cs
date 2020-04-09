using System;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public class DecimalResponse : ResponseValue, IDecimalResponse
    {
        public double Value { get; set; }

    }
}