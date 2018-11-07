using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.SDK
{
    public abstract class ResponseValidator
    {
        public abstract bool ValidateResponse(IResponseType data, Dictionary<string, IQuestionConfiguration> configuration);
    }
}