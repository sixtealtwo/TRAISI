using System.Collections.Generic;
using TRAISI.SDK.Enums;
namespace TRAISI.SDK.Interfaces
{
	public interface ISurveyResource
	{
		string ResourceName { get; }

		string Value { get; set; }


	}
}