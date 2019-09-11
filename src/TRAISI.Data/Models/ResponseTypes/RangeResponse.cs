using DAL.Models.Questions;
using DAL.Models.Surveys;
using TRAISI.SDK.Library.ResponseTypes;
namespace DAL.Models.ResponseTypes
{
	public class RangeResponse : ResponseValue, IRangeResponse
	{
		public double MinValue { get; set; }

		public double MaxValue { get; set; }

	}
}