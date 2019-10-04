using System;
using System.Collections.Generic;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.SDK {
	public abstract class ResponseValidator {
		public abstract bool ValidateResponse (List<IResponseType> data, ICollection<IQuestionConfiguration> configuration);
	}
}