using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK
{
    public abstract class ResponseValidator<T>
    {
         public abstract bool ValidateResponse(T data);
    }
}