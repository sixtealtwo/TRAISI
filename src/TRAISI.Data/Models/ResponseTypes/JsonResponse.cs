using System.ComponentModel.DataAnnotations.Schema;
using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using Newtonsoft.Json.Linq;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
	public class JsonResponse : ResponseValue, IJsonResponse
	{
		[Column(TypeName = "jsonb")]
		public string Value { get; set; }
	}

}