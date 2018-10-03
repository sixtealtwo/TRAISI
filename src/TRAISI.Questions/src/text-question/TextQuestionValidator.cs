using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;

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
        /// <returns></returns>
        public override bool ValidateResponse(IResponseType data)
        {
            return true;
        }
    }
}