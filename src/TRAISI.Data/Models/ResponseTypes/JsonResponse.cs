using System;
using System.ComponentModel.DataAnnotations.Schema;
using DAL.Models.Questions;
using DAL.Models.Surveys;
using Newtonsoft.Json.Linq;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
	public class JsonResponse : ResponseValue, IJsonResponse
	{
		[Column(TypeName = "jsonb")]
		public string Value { get; set; }

        public object ExportValue()
        {
            throw new NotImplementedException();
        }
    }

}