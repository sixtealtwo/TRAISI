using System;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public class IntegerResponse : ResponseValue, IIntegerResponse
    {
   
        public int Value { get; set; }

        public object ExportValue()
        {
            throw new NotImplementedException();
        }
    }
}