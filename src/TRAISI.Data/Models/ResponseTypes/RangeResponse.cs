using TRAISI.Data.Models.Questions;
using TRAISI.Data.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.Data.Models.ResponseTypes
{
	public class RangeResponse : ResponseValue, IRangeResponse
	{
		public double MinValue { get; set; }

		public double MaxValue { get; set; }

	}
}