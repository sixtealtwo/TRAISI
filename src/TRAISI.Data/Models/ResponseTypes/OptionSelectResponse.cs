using System;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
    public class OptionSelectResponse : ResponseValue, IOptionSelectResponse
    {

        public string Value { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public object ExportValue()
        {
            throw new NotImplementedException();
        }
    }
}