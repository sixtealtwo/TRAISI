using System;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.SDK.Questions
{

    public class NumberQuestionValidator : ResponseValidator
    {
        public NumberQuestionValidator()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public override bool ValidateResponse<IDecimalResponse>(List<IDecimalResponse> data, ICollection<IQuestionConfiguration> configuration)
        {
            return true;
        }
    }
}