using System;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;
using System.Linq;
namespace TRAISI.SDK.Questions
{

    public class TextQuestionValidator : ResponseValidator
    {

        public TextQuestionValidator()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public override bool ValidateResponse<IStringResponse>(List<IStringResponse> data, ICollection<IQuestionConfiguration> configuration)
        {
			var maxLengthConfig = configuration.FirstOrDefault( (config) => config.Name == TextQuestionConfiguration.MAX_LENGTH);
            return true;
        }
    }
}