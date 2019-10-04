using System;
using System.Collections.Generic;
using System.Linq;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;
namespace TRAISI.SDK.Questions {

	public class NumberQuestionValidator : ResponseValidator {
		public NumberQuestionValidator () { }

		/// <summary>
		/// 
		/// </summary>
		/// <param name="data"></param>
		/// <param name="configuration"></param>
		/// <returns></returns>
		public override bool ValidateResponse (List<IResponseType> response, ICollection<IQuestionConfiguration> configuration) {

			if (response.Count == 0) {
				return false;
			} else {
				var data = (IDecimalResponse) response[0];
				var maxConfig = configuration.FirstOrDefault ((config) => config.Name == NumberQuestionConfiguration.MAX_VALUE);
				var minConfig = configuration.FirstOrDefault ((config) => config.Name == NumberQuestionConfiguration.MIN_VALUE);

				if (data.Value < double.Parse (minConfig.Value) || data.Value > double.Parse (maxConfig.Value)) {
					return false;
				}
			}

			return true;
		}
	}
}