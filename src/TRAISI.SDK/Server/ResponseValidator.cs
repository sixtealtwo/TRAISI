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
        public abstract bool ValidateResponse<T>(List<T> data, ICollection<IQuestionConfiguration> configuration) where T : IResponseType;
    }
}