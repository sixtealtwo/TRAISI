using System;

namespace TRAISI.SDK.Library.ResponseTypes {
	public interface ITimelineResponse : IResponseType {
		string Purpose { get; set; }

		string Name { get; set; }

		DateTimeOffset TimeA { get; set; }

		DateTimeOffset TimeB { get; set; }

		int? Order { get; set; }
	}
}