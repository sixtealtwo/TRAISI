using System.Collections.Generic;
using TRAISI.SDK;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.SDK.Questions
{
    public class DateQuestionValidator : ResponseValidator
    {

        public DateQuestionValidator()
        {

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public override bool ValidateResponse<IDateTimeResponse>(List<IDateTimeResponse> data, ICollection<IQuestionConfiguration> configuration)
        {
            return true;
        }
    }
}